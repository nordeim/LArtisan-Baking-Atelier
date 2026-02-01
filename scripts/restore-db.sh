#!/bin/bash
# ============================================
# L'Artisan Baking Atelier - Database Restore Script
# Restores database from backup file
# ============================================

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups}"
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-artisan}"
DB_NAME="${DB_NAME:-artisan_atelier}"
S3_BUCKET="${BACKUP_S3_BUCKET:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# Show usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS] [BACKUP_FILE]

Restore database from backup file

Options:
    -h, --help          Show this help message
    -l, --list          List available backups
    -f, --force         Skip confirmation prompt
    -s, --s3            Download from S3 first
    --create-db         Create database if it doesn't exist
    BACKUP_FILE         Path to backup file or filename

Examples:
    $0 --list                           # List available backups
    $0 artisan_atelier_20240115_120000.sql.gz  # Restore specific backup
    $0 -s artisan_atelier_latest.sql.gz       # Download from S3 and restore
    $0 --create-db backup.sql.gz              # Create DB and restore

EOF
}

# List available backups
list_backups() {
    log "Available local backups:"
    if [ -d "$BACKUP_DIR" ] && [ "$(ls -A "$BACKUP_DIR"/*.sql.gz 2>/dev/null)" ]; then
        ls -lh "$BACKUP_DIR"/*.sql.gz | awk '{printf "  %-20s %s\n", $9, $5}'
    else
        warn "No local backups found in $BACKUP_DIR"
    fi
    
    if [ -n "$S3_BUCKET" ]; then
        log "Available S3 backups:"
        aws s3 ls "s3://$S3_BUCKET/backups/" --human-readable | awk '{printf "  s3://'$S3_BUCKET'/backups/%-40s %s %s\n", $4, $3, $1}' || warn "Unable to list S3 backups"
    fi
}

# Download from S3
download_from_s3() {
    local filename="$1"
    local local_path="$BACKUP_DIR/$filename"
    
    if [ -z "$S3_BUCKET" ]; then
        error "S3 bucket not configured. Set BACKUP_S3_BUCKET environment variable."
        exit 1
    fi
    
    log "Downloading $filename from S3..."
    if aws s3 cp "s3://$S3_BUCKET/backups/$filename" "$local_path"; then
        log "Download complete: $local_path"
        echo "$local_path"
    else
        error "Failed to download from S3"
        exit 1
    fi
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"
    
    log "Verifying backup integrity..."
    if gunzip -t "$backup_file" 2>/dev/null; then
        log "Backup integrity verified"
        return 0
    else
        error "Backup file is corrupted or invalid!"
        return 1
    fi
}

# Parse arguments
FORCE=false
FROM_S3=false
CREATE_DB=false
BACKUP_FILE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -l|--list)
            list_backups
            exit 0
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        -s|--s3)
            FROM_S3=true
            shift
            ;;
        --create-db)
            CREATE_DB=true
            shift
            ;;
        *)
            BACKUP_FILE="$1"
            shift
            ;;
    esac
done

# Check if backup file specified
if [ -z "$BACKUP_FILE" ]; then
    error "No backup file specified"
    usage
    exit 1
fi

# Download from S3 if requested
if [ "$FROM_S3" = true ]; then
    BACKUP_FILE=$(download_from_s3 "$BACKUP_FILE")
fi

# Resolve full path
if [ ! -f "$BACKUP_FILE" ]; then
    if [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
        BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
    else
        error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
fi

log "Restore target:"
info "  Backup file: $BACKUP_FILE"
info "  Database: $DB_NAME"
info "  Host: $DB_HOST:$DB_PORT"

# Verify backup
verify_backup "$BACKUP_FILE"

# Check database connection
log "Checking database connection..."
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; then
    error "Database is not accessible at $DB_HOST:$DB_PORT"
    exit 1
fi

# Create database if requested
if [ "$CREATE_DB" = true ]; then
    log "Creating database if it doesn't exist..."
    PGPASSWORD="${DB_PASSWORD}" psql \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d postgres \
        -c "CREATE DATABASE \"$DB_NAME\" WITH OWNER = \"$DB_USER\" ENCODING = 'UTF8';" 2>/dev/null || warn "Database may already exist"
fi

# Confirmation prompt
if [ "$FORCE" = false ]; then
    warn "⚠️  WARNING: This will REPLACE all data in database '$DB_NAME'!"
    warn "Current data will be LOST!"
    echo
    read -p "Are you sure you want to continue? Type 'yes' to proceed: " confirm
    if [ "$confirm" != "yes" ]; then
        log "Restore cancelled by user"
        exit 0
    fi
fi

# Create pre-restore backup (safety net)
if [ "$FORCE" = false ]; then
    SAFETY_BACKUP="$BACKUP_DIR/pre_restore_$(date +%Y%m%d_%H%M%S).sql.gz"
    log "Creating safety backup before restore..."
    PGPASSWORD="${DB_PASSWORD}" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --format=custom | gzip > "$SAFETY_BACKUP"
    log "Safety backup created: $SAFETY_BACKUP"
fi

# Perform restore
log "Starting database restore..."
log "This may take several minutes depending on backup size..."

# Drop and recreate schema for clean restore
log "Preparing database for restore..."
PGPASSWORD="${DB_PASSWORD}" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO $DB_USER; GRANT ALL ON SCHEMA public TO public;" 2>/dev/null || true

# Restore from backup
if gunzip < "$BACKUP_FILE" | PGPASSWORD="${DB_PASSWORD}" pg_restore \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --verbose \
    --no-owner \
    --no-privileges \
    2>&1 | tee -a "$BACKUP_DIR/restore_$(date +%Y%m%d_%H%M%S).log"; then
    log "Database restore completed successfully!"
else
    error "Database restore encountered errors. Check the log file."
    if [ -n "$SAFETY_BACKUP" ]; then
        warn "You can restore from the safety backup: $SAFETY_BACKUP"
    fi
    exit 1
fi

# Verify restore
log "Verifying database after restore..."
TABLE_COUNT=$(PGPASSWORD="${DB_PASSWORD}" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)

log "Database contains $TABLE_COUNT tables"

# Run ANALYZE for query optimization
log "Running ANALYZE for query optimization..."
PGPASSWORD="${DB_PASSWORD}" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -c "ANALYZE;" > /dev/null 2>&1

log "Database restore completed successfully!"
info "  Restored from: $BACKUP_FILE"
info "  Database: $DB_NAME"
info "  Tables: $TABLE_COUNT"
if [ -n "$SAFETY_BACKUP" ]; then
    info "  Safety backup: $SAFETY_BACKUP"
fi

# Cleanup temporary files if downloaded from S3
if [ "$FROM_S3" = true ]; then
    log "Removing temporary backup file..."
    rm "$BACKUP_FILE"
fi

exit 0
