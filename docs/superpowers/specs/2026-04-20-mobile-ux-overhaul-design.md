# Mobile UX Overhaul — Design Spec
_Date: 2026-04-20_

## Overview

Improve the mobile experience of the Focus todo app across five areas: bottom navigation, task detail presentation, task creation, task row gestures, and a new Settings page. Desktop behaviour is unchanged unless noted.

---

## 1. Bottom Navigation

**Current:** 4 tabs — Today / All / Projects / Account (links to `/login`)

**New:** 5 items — Today / All / [FAB] / Projects / Settings

### Layout
- `Today` — `Zap` icon (Lucide)
- `All` — `List` icon (Lucide)
- Centre — gradient FAB (`Plus` icon, 46px circle, `linear-gradient(135deg, #7C6FF7, #5E9EF7)`, `box-shadow: 0 0 22px rgba(124,111,247,0.55)`) floating ~10px above the bar
- `Projects` — `FolderOpen` icon (Lucide)
- `Settings` — `SlidersHorizontal` icon (Lucide)

### Behaviour
- FAB tap opens the `CreateTaskModal` (same modal used in page headers)
- Active tab: icon colour `#7C6FF7`, `strokeWidth={2.5}`, label colour `#7C6FF7`
- Inactive tab: icon colour `#454a5c`, `strokeWidth={1.8}`
- Settings tab routes to `/settings`

---

## 2. Settings Page (`/settings`)

New route: `app/(app)/settings/page.tsx`

### Content (MVP)
- Page header: "Settings"
- **Account section:**
  - Displays signed-in email (read from Supabase session)
  - "Sign Out" button — calls `supabase.auth.signOut()` then redirects to `/login`
- Designed with expansion in mind: future sections (notifications, theme, etc.) slot in below Account

### Architecture
- Server component for the page shell (reads user email server-side)
- `SignOutButton` client component for the sign-out action (needs `'use client'` for the Supabase browser client call + router redirect)

---

## 3. Task Detail Panel → Bottom Sheet on Mobile

**Current:** Fixed right slide-in, `w-[380px]`, always.

**New:**
- **Mobile (`< md`):** slides up from bottom as a sheet
  - Height: `85vh` max, scrollable inside
  - Drag handle (32×3px pill) at top centre
  - `border-radius: 20px 20px 0 0` on top edge
  - Animation: `y: '100%' → 0`, spring `damping: 32, stiffness: 280`
  - Dismiss: tap overlay OR drag sheet down past 80px threshold (use `useDragControls` + `dragConstraints`)
  - Bottom padding accounts for mobile safe area (`pb-safe` or `pb-8`)
- **Desktop (`≥ md`):** unchanged — right slide-in `w-[380px]`

### Implementation note
Use a `useIsMobile()` hook (checks `window.innerWidth < 768`) to switch render between the two layouts within the same `TaskDetailPanel` component. No separate component needed.

---

## 4. Create Task Modal → Bottom Sheet on Mobile

**Current:** Centred modal, `max-w-[480px]`, always.

**New:**
- **Mobile:** renders as a bottom sheet (same pattern as Task Detail — slides up, 85vh max, drag handle, spring animation)
- **Desktop:** unchanged centred modal

Same `useIsMobile()` hook drives the conditional layout inside `CreateTaskModal`.

---

## 5. Task Row Swipe Gestures

### Swipe Right → Complete
- Reveal: green (`#22c55e`) background, `Check` icon + "Complete" label on left
- Threshold: 60px drag triggers action on release
- On complete: runs existing `completeTask()` action, row animates out via `AnimatePresence`

### Swipe Left → Delete
- Reveal: red (`#ef4444`) background, `Trash2` icon + "Delete" label on right
- Threshold: 60px drag triggers `softDeleteTask()` on release
- Undo toast appears (existing `UndoToast` component)

### Implementation
- Add `drag="x"` with `dragConstraints` and `onDragEnd` to the `motion.div` in `TaskRow`
- Use `dragElastic: 0.1` for a snappy, controlled feel
- Desktop: gestures disabled (`drag={isMobile}`)
- Subtask delete button: always visible on mobile (remove `opacity-0 group-hover/st:opacity-100` on mobile)

### Touch target sizing
- Checkbox hit area expanded to 44×44px using padding (visual size stays 18px)
- All interactive buttons meet 44px minimum on mobile

---

## 6. QuickAdd — Mobile Polish

- Add an explicit "Add" button (small, `→` or `↵` icon) that appears on focus — not just Enter
- Enlarges the input tap area on mobile
- `↵ to add` hint replaced by the visible button on mobile

---

## Out of Scope
- Pull-to-refresh
- Haptic feedback (web API not widely supported)
- Drag-to-reorder tasks
- Any Settings functionality beyond Sign Out

---

## Files Affected

| File | Change |
|---|---|
| `components/mobile-nav.tsx` | Rebuild with FAB + Settings tab |
| `app/(app)/settings/page.tsx` | New — settings page shell |
| `components/sign-out-button.tsx` | New — client component for sign-out |
| `components/task-detail-panel.tsx` | Bottom sheet on mobile |
| `components/create-task-modal.tsx` | Bottom sheet on mobile |
| `components/task-row.tsx` | Swipe gestures, bigger touch targets |
| `components/task-detail-panel.tsx` | Subtask delete always visible on mobile |
| `components/quick-add.tsx` | Mobile add button |
| `lib/hooks/use-is-mobile.ts` | New — shared mobile detection hook |
