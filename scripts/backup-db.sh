#!/bin/bash
# ============================================
# L'Artisan Baking Atelier - Database Backup Script
# Creates compressed backup and uploads to S3/cloud storage
# ============================================

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups}"
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-artisan}"
DB_NAME="${DB_NAME:-artisan_atelier}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
S3_BUCKET="${BACKUP_S3_BUCKET:-}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="artisan_atelier_${DB_NAME}_${TIMESTAMP}.sql.gz"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARN:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

log "Starting database backup..."
log "Backup file: $BACKUP_FILE"

# Check if database is accessible
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; then
    error "Database is not accessible at $DB_HOST:$DB_PORT"
    exit 1
fi

log "Database connection verified"

# Create backup with pg_dump
log "Creating database dump..."
if PGPASSWORD="${DB_PASSWORD}" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --verbose \
    --format=custom \
    --file="$BACKUP_DIR/$BACKUP_FILE" 2>&1 | tee -a "$BACKUP_DIR/backup_${TIMESTAMP}.log"; then
    log "Backup created successfully: $BACKUP_FILE"
else
    error "Backup failed!"
    exit 1
fi

# Get file size
FILE_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
log "Backup size: $FILE_SIZE"

# Verify backup integrity
log "Verifying backup integrity..."
if gunzip -t "$BACKUP_DIR/$BACKUP_FILE" 2>/dev/null; then
    log "Backup integrity verified"
else
    error "Backup integrity check failed!"
    exit 1
fi

# Upload to S3 if bucket is configured
if [ -n "$S3_BUCKET" ] && [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
    log "Uploading backup to S3..."
    if aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "s3://$S3_BUCKET/backups/$BACKUP_FILE" --storage-class STANDARD_IA; then
        log "Backup uploaded to S3: s3://$S3_BUCKET/backups/$BACKUP_FILE"
        
        # Remove local backup after successful S3 upload
        rm "$BACKUP_DIR/$BACKUP_FILE"
        log "Local backup removed after S3 upload"
    else
        error "Failed to upload backup to S3"
        # Keep local backup as fallback
    fi
fi

# Cleanup old backups (local)
log "Cleaning up local backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "artisan_atelier_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "backup_*.log" -type f -mtime +$RETENTION_DAYS -delete
log "Local cleanup complete"

# Cleanup old backups (S3)
if [ -n "$S3_BUCKET" ]; then
    log "Cleaning up S3 backups older than $RETENTION_DAYS days..."
    aws s3 ls "s3://$S3_BUCKET/backups/" | while read -r line; do
        file_date=$(echo "$line" | awk '{print $1}')
        file_name=$(echo "$line" | awk '{print $4}')
        
        # Check if file is older than retention period
        file_timestamp=$(date -d "$file_date" +%s 2>/dev/null || echo 0)
        cutoff_timestamp=$(date -d "$RETENTION_DAYS days ago" +%s)
        
        if [ "$file_timestamp" -lt "$cutoff_timestamp" ]; then
            aws s3 rm "s3://$S3_BUCKET/backups/$file_name" --quiet
            log "Removed old backup from S3: $file_name"
        fi
    done
fi

log "Backup process completed successfully!"
log "Backup location: $BACKUP_DIR/$BACKUP_FILE"

# Output backup info for potential use by calling process
cat <<EOF
{
  "status": "success",
  "backup_file": "$BACKUP_FILE",
  "backup_path": "$BACKUP_DIR/$BACKUP_FILE",
  "size": "$FILE_SIZE",
  "timestamp": "$TIMESTAMP",
  "database": "$DB_NAME"
}
EOF
