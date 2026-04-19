# Todo App — Design Spec
**Date:** 2026-04-19
**Status:** Approved

---

## Overview

A personal (but multi-user) todo web app for managing work and university tasks. Users sign in with Google or email and get a fully isolated workspace. Deployed to Vercel, accessible from any device.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Database + Auth | Supabase (Postgres + RLS + OAuth) |
| Styling | Tailwind CSS + shadcn/ui |
| Icons | Lucide React |
| Deployment | Vercel |
| Font | Inter (Google Fonts) |

---

## Structure

```
app/
  (auth)/
    login/page.tsx          → Google OAuth + email/password
  (app)/
    layout.tsx              → Authenticated shell: Sidebar + main area
    today/page.tsx          → Default landing: Today view
    all/page.tsx            → All tasks across projects
    projects/[id]/page.tsx  → Single project task list
  api/                      → Server Actions (no separate REST layer)
```

---

## UI Design System

**Style:** Modern dark cinematic — deep dark background, indigo/purple accents, micro-interactions.

| Token | Value |
|---|---|
| Background | `linear-gradient(160deg, #0d0d14, #07070d)` |
| Surface | `rgba(255,255,255,0.03)` |
| Border | `rgba(255,255,255,0.06)` |
| Accent | `#5E6AD2` (indigo) |
| Accent glow | `rgba(94,106,210,0.3)` |
| Foreground | `#ededef` |
| Muted | `#8a8f98` |
| Subtle | `#4a4f5a` |
| Destructive | `#DC2626` |
| Font | Inter 300/400/500/600/700 |
| Radius | 10px (cards), 8px (buttons/inputs) |
| Animation easing | `cubic-bezier(0.16, 1, 0.3, 1)` 150–300ms |

**Icons:** Lucide React — consistent 1.5px stroke, no emojis as icons.

**Project colors (user-assignable):**
- Work: `#5E6AD2` (indigo)
- University: `#34d399` (emerald)
- Personal: `#f59e0b` (amber)

---

## Navigation

- **Sidebar** (220px, always visible on desktop): logo, Today, All Tasks, Projects list, Add project, user avatar/email
- **Today** is the default landing page after login
- **Mobile:** sidebar collapses to a bottom nav (Today, Projects, All, Profile) — max 4 items

---

## Views

### Today View (`/today`)
- Stat strip: Completed today (X/N + progress bar), Streak (days), Overdue count
- Tasks grouped by project, filtered to: `due_date <= today (incomplete) OR priority = urgent`
  - This includes overdue incomplete tasks so nothing silently falls off the radar
  - Completed tasks are excluded from Today (already in streak/completed count)
- Each group shows project color dot + name
- Quick-add bar at bottom: "Add a task for today..."

### Project View (`/projects/[id]`)
- Full task list for one project
- Sort order: incomplete first, ordered by priority (urgent → high → medium → low → none), then due_date ASC (nulls last), then created_at ASC — fully deterministic, no reordering surprises
- Completed tasks shown at bottom, sorted by completed_at DESC
- Quick-add bar at bottom

### All Tasks View (`/all`)
- All tasks across all projects, grouped by project
- Same task row component

---

## Task Features

Each task has:
- **Title** (required)
- **Notes** (optional, plain text)
- **Due date** (optional, date picker)
- **Priority**: none | low | medium | high | urgent
- **Completed** (boolean + timestamp)
- **Subtasks** (list of title + completed)

**Task row** shows: checkbox, title, priority tag (if set), due date (if set), project dot (in Today/All views).

**Task detail panel:** Slides in from the right when clicking a task row. Shows all fields editable inline. Subtasks listed below with their own checkboxes.

**Quick-add:** Inline input at bottom of list. `Enter` saves with just a title. `Tab` or clicking fields to optionally set due date/priority before saving.

---

## Data Model

```sql
-- Managed by Supabase Auth
users: id, email, name, avatar_url

-- User-created projects
projects:
  id          uuid PK
  user_id     uuid FK → auth.users (RLS)
  name        text NOT NULL
  color       text NOT NULL  -- hex color
  emoji       text           -- optional
  created_at  timestamptz

-- Tasks
tasks:
  id            uuid PK
  user_id       uuid FK → auth.users (RLS)
  project_id    uuid FK → projects
  title         text NOT NULL
  notes         text
  due_date      date
  priority      text CHECK (priority IN ('none','low','medium','high','urgent'))
  completed     boolean DEFAULT false
  completed_at  timestamptz
  created_at    timestamptz
  updated_at    timestamptz

-- Subtasks (no user_id — RLS via EXISTS join to parent task)
subtasks:
  id          uuid PK
  task_id     uuid FK → tasks ON DELETE CASCADE
  title       text NOT NULL
  completed   boolean DEFAULT false
  position    integer  -- for ordering
```

**Row Level Security:**
- `projects`: `user_id = auth.uid()` on all operations.
- `tasks`: `user_id = auth.uid()` on all operations. INSERT/UPDATE policy also checks `project_id` belongs to `auth.uid()` — prevents cross-user project assignment:
  ```sql
  EXISTS (SELECT 1 FROM projects WHERE id = tasks.project_id AND user_id = auth.uid())
  ```
- `subtasks`: No `user_id` column. RLS policy uses EXISTS join through parent task:
  ```sql
  EXISTS (SELECT 1 FROM tasks WHERE id = subtasks.task_id AND user_id = auth.uid())
  ```
  Cascade delete on `task_id` ensures subtasks are cleaned up when a task is deleted.

---

## Auth Flow

1. Any `(app)/*` route → Next.js middleware checks Supabase session cookie
2. No session → redirect to `/login`
3. `/login` → Google OAuth (one click) OR email + password
4. Successful auth → Supabase sets session cookie → redirect to `/today`
5. Sign-out → clears cookie → redirect to `/login`

**Multi-user:** Any person can sign up and get their own isolated workspace. RLS guarantees data isolation at the database level.

---

## Timezone Handling

**Source of truth:** Browser/client timezone, not server timezone.

- `due_date` is stored as a plain `date` (no time component) — avoids UTC offset confusion.
- "Today" is computed client-side using `new Date()` in the user's local timezone and passed as a date string to queries.
- "Completed today" and streak calculations use the same client timezone.
- No user timezone preference stored in the DB — the browser is always authoritative. This is sufficient for a single-user-per-account personal app.

---

## Key Components

| Component | Purpose |
|---|---|
| `Sidebar` | Navigation, project list, user info |
| `TaskRow` | Single task: checkbox, title, tags, date |
| `TaskDetailPanel` | Slide-in right panel: full task edit |
| `QuickAdd` | Inline fast-add input at list bottom |
| `NewTaskModal` | Full form modal via "+ Add Task" button |
| `StatCard` | Today view stat (completed, streak, overdue) |
| `ProjectDot` | Colored dot indicating task's project |
| `EmptyState` | Helpful message + CTA when list is empty |

---

## UX Standards (from UI/UX Pro Max)

- Touch targets ≥ 44px
- Animation duration 150–300ms, `cubic-bezier(0.16,1,0.3,1)` easing
- Skeleton loading for async data (no blank screens)
- Empty states with message + action button
- Active nav item highlighted with indigo color + background tint
- Delete is **soft-delete**: tasks get a `deleted_at` timestamp, hidden from all views immediately. A toast with "Undo" appears for 5 seconds. If undone, `deleted_at` is cleared. After 5s the client fires a hard DELETE. This requires adding `deleted_at timestamptz` to the `tasks` table and excluding `deleted_at IS NOT NULL` from all queries.
- `prefers-reduced-motion` respected
- Keyboard navigable (Tab order matches visual order)
- WCAG AA contrast minimum (4.5:1 for text)
