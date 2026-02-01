# Phase 11.4: Student Progress Dashboard - Detailed Implementation Plan

## Sub-Plan Version: 1.0.0
**Status:** Ready for Execution  
**Estimated Duration:** 4-5 days  
**Prerequisites:** Phase 11.3 Complete (Video schema & infrastructure)

---

## Executive Summary

Build a comprehensive student progress tracking system that enables learners to:
- Track course completion progress with visual indicators
- Resume lessons from where they left off
- Earn achievements and badges
- View learning statistics and streaks
- Access course content through an intuitive video player interface

---

## 11.4.1 Component Architecture

### Progress Visualization Components

| Component | File | Purpose | Props Interface |
|-----------|------|---------|-----------------|
| CourseProgressCard | `src/components/student/CourseProgressCard.tsx` | Course card with progress ring | `{ course, progress, lastAccessed }` |
| LessonList | `src/components/student/LessonList.tsx` | List of lessons with status | `{ lessons, progress, onSelect }` |
| ProgressRing | `src/components/student/ProgressRing.tsx` | Circular progress indicator | `{ percent, size, strokeWidth }` |
| AchievementBadge | `src/components/student/AchievementBadge.tsx` | Badge display component | `{ achievement, earned, date }` |
| StudyStreak | `src/components/student/StudyStreak.tsx` | Streak counter & calendar | `{ streak, history }` |
| VideoPlayer | `src/components/video/VideoPlayer.tsx` | Custom video player | `{ src, poster, lessonId, onProgress }` |

### Dashboard Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| StudentSidebar | `src/components/student/StudentSidebar.tsx` | Navigation for student area |
| ProgressStats | `src/components/student/ProgressStats.tsx` | Overall statistics cards |
| AchievementGrid | `src/components/student/AchievementGrid.tsx` | Grid of achievements |
| LessonSidebar | `src/components/video/LessonSidebar.tsx` | Lesson navigation in player |

---

## 11.4.2 Page Routes & Structure

### New Pages

| Route | File | Purpose | Auth Required |
|-------|------|---------|---------------|
| `/account/progress` | `src/app/(shop)/account/progress/page.tsx` | Overall learning dashboard | ✅ |
| `/account/achievements` | `src/app/(shop)/account/achievements/page.tsx` | Achievement gallery | ✅ |
| `/account/courses/[id]` | `src/app/(shop)/account/courses/[id]/page.tsx` | Course video player | ✅ |
| `/account/activity` | `src/app/(shop)/account/activity/page.tsx` | Recent activity feed | ✅ |

### Page Components Structure

```
account/
├── progress/
│   └── page.tsx              # Main dashboard
├── achievements/
│   └── page.tsx              # Achievement gallery
├── activity/
│   └── page.tsx              # Activity timeline
└── courses/
    └── [id]/
        ├── page.tsx          # Course player
        └── layout.tsx        # Player layout with sidebar
```

---

## 11.4.3 API Routes

### Progress API Endpoints

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/account/progress` | GET | Get all course progress | JWT |
| `/api/account/progress/overview` | GET | Get overall statistics | JWT |
| `/api/account/progress/course/[id]` | GET | Get specific course progress | JWT |
| `/api/account/progress/lesson` | POST | Update lesson progress | JWT |
| `/api/account/progress/lesson/[id]` | GET | Get lesson progress | JWT |
| `/api/account/achievements` | GET | Get earned achievements | JWT |
| `/api/account/achievements/check` | POST | Check & award achievements | JWT |
| `/api/account/activity` | GET | Get recent activity | JWT |

### API Types

```typescript
// POST /api/account/progress/lesson
interface UpdateLessonProgressRequest {
  lessonId: string;
  currentTime: number;      // seconds
  progressPercent: number;  // 0-100
  completed?: boolean;
}

// GET /api/account/progress/overview
interface ProgressOverviewResponse {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessonsCompleted: number;
  totalWatchTime: number;   // minutes
  currentStreak: number;
  longestStreak: number;
  achievementsEarned: number;
  studyTimeThisWeek: number;
}
```

---

## 11.4.4 Achievement System

### Achievement Types

| ID | Name | Description | Icon | Condition |
|----|------|-------------|------|-----------|
| `first-course` | First Steps | Complete your first course | 🥉 | 1 course completed |
| `course-collector` | Course Collector | Complete 3 courses | 🥈 | 3 courses completed |
| `master-baker` | Master Baker | Complete 5 courses | 🥇 | 5 courses completed |
| `speed-learner` | Speed Learner | Complete a course in 7 days | ⚡ | Course completed within 7 days of purchase |
| `perfect-score` | Perfectionist | 100% completion on all lessons | 🎯 | All lessons 100% watched |
| `early-bird` | Early Bird | Study 5 days in a row | 🌅 | 5-day streak |
| `night-owl` | Night Owl | Study after 10 PM | 🦉 | Activity between 10 PM - 6 AM |
| `weekend-warrior` | Weekend Warrior | Study on weekends | 🏆 | Activity on Saturday or Sunday |
| `first-lesson` | Getting Started | Complete your first lesson | 📚 | 1 lesson completed |
| `halfway-there` | Halfway There | Complete 50% of a course | ⭐ | 50% progress in any course |

### Achievement Data Model

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserAchievement {
  achievementId: string;
  earnedAt: Date;
  progress?: number; // For partial progress
}
```

---

## 11.4.5 Database Queries

### Get Course Progress

```typescript
// Get course with lessons and progress
const courseWithProgress = await prisma.product.findUnique({
  where: { id: courseId },
  include: {
    lessons: {
      orderBy: { order: 'asc' },
      include: {
        progress: {
          where: { userId: userId },
        },
      },
    },
    digitalAccess: {
      where: { userId: userId },
    },
  },
});
```

### Update Lesson Progress

```typescript
// Upsert lesson progress
await prisma.lessonProgress.upsert({
  where: {
    userId_lessonId: {
      userId: userId,
      lessonId: lessonId,
    },
  },
  update: {
    progressPercent,
    currentTime,
    lastWatchedAt: new Date(),
    completedAt: completed ? new Date() : undefined,
  },
  create: {
    userId,
    lessonId,
    digitalAccessId,
    progressPercent,
    currentTime,
    lastWatchedAt: new Date(),
    completedAt: completed ? new Date() : null,
  },
});
```

---

## 11.4.6 UI/UX Design Specifications

### Progress Ring Component

```typescript
// ProgressRing.tsx
interface ProgressRingProps {
  percent: number;        // 0-100
  size?: number;          // Default: 80
  strokeWidth?: number;   // Default: 6
  color?: string;         // Default: crust-400
}
```

**Visual Design:**
- Circular SVG with two paths (background + progress)
- Animated transition on progress change
- Center text showing percentage
- Color-coded: crust-400 for in-progress, sage-400 for complete

### Course Card with Progress

**Layout:**
```
┌─────────────────────────────────┐
│  [Image]                        │
│                                 │
├─────────────────────────────────┤
│  Course Title                   │
│  Progress Ring    65% Complete  │
│  [=======------]                │
│  Last accessed: 2 days ago      │
│  [Continue Learning →]          │
└─────────────────────────────────┘
```

### Lesson List Item

**States:**
- 🔒 Locked (previous lesson not complete)
- ⭕ Not started
| 🟡 In progress
| ✅ Completed

**Layout:**
```
┌──────────────────────────────────────┐
│ ⭕ │ 1. Introduction to Sourdough   │
│    │ Duration: 12:30                │
│    │ [Not started]                  │
├──────────────────────────────────────┤
| ✅ │ 2. Creating Your Starter       │
│    │ Duration: 18:45                │
│    │ Completed 3 days ago           │
└──────────────────────────────────────┘
```

---

## 11.4.7 Streak Tracking Logic

### Study Streak Calculation

```typescript
function calculateStreak(activities: Date[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let checkDate = today;
  
  // Check today or yesterday for current streak
  const hasActivityToday = activities.some(
    d => d.toDateString() === today.toDateString()
  );
  
  if (!hasActivityToday) {
    // Check if streak continued through yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const hasActivityYesterday = activities.some(
      d => d.toDateString() === yesterday.toDateString()
    );
    
    if (!hasActivityYesterday) return 0;
    
    checkDate = yesterday;
  }
  
  // Count back consecutive days
  while (true) {
    const hasActivity = activities.some(
      d => d.toDateString() === checkDate.toDateString()
    );
    
    if (hasActivity) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}
```

---

## 11.4.8 Implementation Checklist

### Day 1: Progress Components
- [ ] Create ProgressRing component with SVG
- [ ] Create CourseProgressCard component
- [ ] Create LessonList component with status icons
- [ ] Style components with Tailwind

### Day 2: Dashboard Pages
- [ ] Create `/account/progress` page
- [ ] Create progress overview stats
- [ ] Create course progress grid
- [ ] Add empty states

### Day 3: Achievement System
- [ ] Create achievement definitions
- [ ] Create AchievementBadge component
- [ ] Create AchievementGrid component
- [ ] Create `/account/achievements` page

### Day 4: API Routes
- [ ] Create progress API endpoints
- [ ] Create achievement check logic
- [ ] Implement streak calculation
- [ ] Add activity tracking

### Day 5: Video Player Integration
- [ ] Create video player page layout
- [ ] Create LessonSidebar component
- [ ] Integrate progress saving
- [ ] Add resume functionality

---

## 11.4.9 Testing Strategy

### Component Tests
- ProgressRing renders correct percentage
- LessonList shows correct status icons
- AchievementBadge displays properly

### Integration Tests
- Progress updates after watching video
- Achievements awarded on completion
- Streak calculation is accurate

### E2E Tests
- User can view progress dashboard
- User can resume lesson from last position
- User can view achievements

---

## 11.4.10 Performance Considerations

- Use React.memo for progress components
- Debounce progress updates (every 5 seconds)
- Lazy load achievement icons
- Cache progress data with SWR/React Query
- Use optimistic updates for progress

---

**Ready for Execution**
