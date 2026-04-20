# Mobile UX Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the mobile experience with a FAB nav, bottom sheets for task detail and create modal, swipe-to-complete/delete on task rows, a real Settings page, and polished touch targets.

**Architecture:** A shared `useIsMobile` hook drives all conditional mobile/desktop behaviour. Task detail and create modal conditionally render as bottom sheets on mobile. Swipe gestures are added to TaskRow via Framer Motion's `drag` API. The mobile nav is rebuilt with a centred FAB and a Settings tab replacing the broken Account link.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, Supabase SSR

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| **Create** | `lib/hooks/use-is-mobile.ts` | Client hook — returns `true` when viewport < 768px |
| **Modify** | `components/mobile-nav.tsx` | Rebuild: 5 items, FAB centre, Settings tab |
| **Modify** | `components/create-task-modal.tsx` | Add `trigger` prop; bottom sheet on mobile |
| **Create** | `app/(app)/settings/page.tsx` | Settings page — email + sign out |
| **Create** | `components/sign-out-button.tsx` | Client component — supabase signOut + redirect |
| **Modify** | `app/(app)/layout.tsx` | Pass `userEmail` and `projects` to `MobileNav` |
| **Modify** | `components/task-detail-panel.tsx` | Bottom sheet on mobile, desktop unchanged |
| **Modify** | `components/task-row.tsx` | Swipe gestures, 44px touch targets, always-visible subtask delete |
| **Modify** | `components/quick-add.tsx` | Replace `↵ to add` hint with tappable Add button |

---

## Task 1: `useIsMobile` hook

**Files:**
- Create: `lib/hooks/use-is-mobile.ts`

- [ ] **Step 1: Create the hook**

```ts
// lib/hooks/use-is-mobile.ts
'use client'
import { useState, useEffect } from 'react'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: no TypeScript errors, build succeeds.

- [ ] **Step 3: Commit**

```bash
git add lib/hooks/use-is-mobile.ts
git commit -m "feat: add useIsMobile hook"
```

---

## Task 2: Rebuild MobileNav (FAB + Settings)

**Files:**
- Modify: `components/mobile-nav.tsx`
- Modify: `components/create-task-modal.tsx` (add `trigger` prop)
- Modify: `app/(app)/layout.tsx` (pass projects + userEmail to MobileNav)

- [ ] **Step 1: Add `trigger` prop to `CreateTaskModal`**

Open `components/create-task-modal.tsx`. Change the `CreateTaskModalProps` interface and render logic:

```tsx
interface CreateTaskModalProps {
  projects: Project[]
  defaultProjectId?: string
  buttonLabel?: string
  trigger?: React.ReactNode
}

export function CreateTaskModal({ projects, defaultProjectId, buttonLabel = 'Add Task', trigger }: CreateTaskModalProps) {
  // ... existing state unchanged ...

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} style={{ display: 'contents' }}>{trigger}</div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-[12px] font-bold text-white transition-all duration-150 hover:opacity-90 hover:shadow-[0_0_28px_rgba(124,111,247,0.5)]"
          style={{ background: 'linear-gradient(135deg, #7C6FF7 0%, #5E9EF7 100%)', boxShadow: '0 0 20px rgba(124,111,247,0.3)' }}
        >
          <Plus className="w-3.5 h-3.5" />
          {buttonLabel}
        </button>
      )}

      <AnimatePresence>
        {/* ... rest of modal unchanged ... */}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 2: Pass `projects` and `userEmail` to MobileNav in the layout**

Open `app/(app)/layout.tsx`. Update `<MobileNav />` to:

```tsx
<MobileNav projects={projects} userEmail={user.email ?? ''} />
```

- [ ] **Step 3: Rewrite `components/mobile-nav.tsx`**

Replace the entire file:

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, List, FolderOpen, SlidersHorizontal, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateTaskModal } from './create-task-modal'
import type { Project } from '@/lib/types'

interface MobileNavProps {
  projects: Project[]
  userEmail: string
}

const NAV_ITEMS = [
  { href: '/today',    icon: Zap,               label: 'Today' },
  { href: '/all',      icon: List,              label: 'All' },
  { href: '/projects', icon: FolderOpen,        label: 'Projects' },
  { href: '/settings', icon: SlidersHorizontal, label: 'Settings' },
]

export function MobileNav({ projects, userEmail: _ }: MobileNavProps) {
  const pathname = usePathname()

  const fab = (
    <button
      type="button"
      aria-label="Add task"
      className="w-[46px] h-[46px] rounded-full flex items-center justify-center mb-3 flex-shrink-0"
      style={{
        background: 'linear-gradient(135deg, #7C6FF7 0%, #5E9EF7 100%)',
        boxShadow: '0 0 22px rgba(124,111,247,0.55), 0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
    </button>
  )

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-[rgba(255,255,255,0.05)]"
      style={{ background: 'rgba(4,4,10,0.92)', backdropFilter: 'blur(24px) saturate(180%)' }}
    >
      <div className="flex items-end h-[60px]">
        {/* Left two tabs */}
        {NAV_ITEMS.slice(0, 2).map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 pb-3 pt-2 text-[10px] font-semibold tracking-wide transition-all duration-200',
                active ? 'text-[#7C6FF7]' : 'text-[#454a5c]'
              )}
            >
              <Icon
                className="w-[18px] h-[18px]"
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                {label}
              </span>
            </Link>
          )
        })}

        {/* FAB */}
        <div className="flex-1 flex justify-center items-end pb-0">
          <CreateTaskModal projects={projects} trigger={fab} />
        </div>

        {/* Right two tabs */}
        {NAV_ITEMS.slice(2).map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 pb-3 pt-2 text-[10px] font-semibold tracking-wide transition-all duration-200',
                active ? 'text-[#7C6FF7]' : 'text-[#454a5c]'
              )}
            >
              <Icon
                className="w-[18px] h-[18px]"
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/mobile-nav.tsx components/create-task-modal.tsx app/\(app\)/layout.tsx
git commit -m "feat: rebuild mobile nav with FAB and Settings tab"
```

---

## Task 3: Settings Page

**Files:**
- Create: `app/(app)/settings/page.tsx`
- Create: `components/sign-out-button.tsx`

- [ ] **Step 1: Create `SignOutButton` client component**

```tsx
// components/sign-out-button.tsx
'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-[13px] font-semibold text-[#f87171] hover:text-red-300 transition-colors"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign out
    </button>
  )
}
```

- [ ] **Step 2: Create Settings page**

```tsx
// app/(app)/settings/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/sign-out-button'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 pt-5 pb-0 flex-shrink-0">
        <h1
          className="text-[20px] font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Account section */}
        <div>
          <p
            className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Account
          </p>
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] overflow-hidden">
            <div className="px-4 py-3 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.06)]">
              <p className="text-[11px] text-[#454a5c] font-medium">Signed in as</p>
              <p className="text-[13px] font-semibold text-[#d8dce8] mt-0.5">{user.email}</p>
            </div>
            <div className="px-4 py-3 bg-[rgba(255,255,255,0.02)]">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: no errors. `/settings` route resolves correctly.

- [ ] **Step 4: Commit**

```bash
git add app/\(app\)/settings/page.tsx components/sign-out-button.tsx
git commit -m "feat: add Settings page with sign-out"
```

---

## Task 4: TaskDetailPanel → Bottom Sheet on Mobile

**Files:**
- Modify: `components/task-detail-panel.tsx`

- [ ] **Step 1: Add imports for `useIsMobile`**

At the top of `components/task-detail-panel.tsx`, update the imports:

```tsx
'use client'
import { useState, useTransition, useEffect, useCallback } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import { X, Trash2, Plus, Check } from 'lucide-react'
import { cn, PRIORITY_LABEL } from '@/lib/utils'
import { updateTask, softDeleteTask, restoreTask, hardDeleteTask } from '@/lib/actions/tasks'
import { createSubtask, updateSubtask, deleteSubtask } from '@/lib/actions/subtasks'
import { UndoToast } from './undo-toast'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import type { TaskWithSubtasks, Priority } from '@/lib/types'
```

- [ ] **Step 2: Add `useIsMobile` and drag handler inside the component**

Inside `TaskDetailPanel`, after the existing state declarations, add:

```tsx
const isMobile = useIsMobile()

function handleSheetDragEnd(_: PointerEvent, info: PanInfo) {
  if (info.offset.y > 80) onClose()
}
```

- [ ] **Step 3: Replace the `motion.aside` with a conditional render**

Replace everything from `<motion.div` (the overlay) through the closing `</motion.aside>` with:

```tsx
{/* Overlay */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
  className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
  onClick={onClose}
/>

{isMobile ? (
  /* ── Mobile: bottom sheet ── */
  <motion.div
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    exit={{ y: '100%' }}
    drag="y"
    dragConstraints={{ top: 0 }}
    dragElastic={{ top: 0, bottom: 0.25 }}
    onDragEnd={handleSheetDragEnd}
    transition={{ type: 'spring', damping: 32, stiffness: 280, mass: 0.8 }}
    className="fixed bottom-0 left-0 right-0 z-40 flex flex-col rounded-t-[20px] border-t border-[rgba(255,255,255,0.08)] max-h-[85vh]"
    style={{ background: 'rgba(8,8,18,0.98)', backdropFilter: 'blur(40px) saturate(180%)' }}
  >
    {/* Drag handle */}
    <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
      <div className="w-8 h-[3px] rounded-full bg-[rgba(255,255,255,0.2)]" />
    </div>

    {/* Header */}
    <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
      <span className="text-[11px] font-semibold text-[#454a5c] uppercase tracking-[1px]"
            style={{ fontFamily: 'var(--font-display)' }}>
        Task Details
      </span>
      <div className="flex items-center gap-1">
        <button onClick={handleDelete}
          className="p-2 rounded-lg text-[#454a5c] hover:text-[#f87171] hover:bg-[rgba(248,113,113,0.1)] transition-all"
          aria-label="Delete task">
          <Trash2 className="w-4 h-4" />
        </button>
        <button onClick={onClose}
          className="p-2 rounded-lg text-[#454a5c] hover:text-[#9099b0] hover:bg-[rgba(255,255,255,0.05)] transition-all"
          aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Scrollable content — same fields as desktop */}
    <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-8">
      {sharedPanelContent}
    </div>
  </motion.div>
) : (
  /* ── Desktop: right slide-in (unchanged) ── */
  <motion.aside
    initial={{ x: '100%' }}
    animate={{ x: 0 }}
    exit={{ x: '100%' }}
    transition={{ type: 'spring', damping: 32, stiffness: 280, mass: 0.8 }}
    className="fixed right-0 top-0 h-full w-[380px] z-40 flex flex-col border-l border-[rgba(255,255,255,0.06)]"
    style={{ background: 'rgba(8,8,18,0.95)', backdropFilter: 'blur(40px) saturate(180%)' }}
  >
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
      <span className="text-[11px] font-semibold text-[#454a5c] uppercase tracking-[1px]"
            style={{ fontFamily: 'var(--font-display)' }}>
        Task Details
      </span>
      <div className="flex items-center gap-1">
        <button onClick={handleDelete}
          className="p-1.5 rounded-lg text-[#454a5c] hover:text-[#f87171] hover:bg-[rgba(248,113,113,0.1)] transition-all"
          aria-label="Delete task">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={onClose}
          className="p-1.5 rounded-lg text-[#454a5c] hover:text-[#9099b0] hover:bg-[rgba(255,255,255,0.05)] transition-all"
          aria-label="Close">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      {sharedPanelContent}
    </div>
  </motion.aside>
)}
```

- [ ] **Step 4: Extract shared panel content into a variable**

To avoid duplicating the fields JSX, extract the inner content above the return statement:

```tsx
const sharedPanelContent = (
  <>
    {/* Title */}
    <input
      value={title}
      onChange={e => setTitle(e.target.value)}
      onBlur={() => title.trim() && save({ title: title.trim() })}
      className="w-full bg-transparent text-[17px] font-semibold text-[#f0f0f5] outline-none placeholder:text-[#454a5c] leading-snug"
      placeholder="Task title"
    />

    {/* Priority */}
    <div>
      <p className="text-[10px] font-semibold text-[#454a5c] uppercase tracking-[1px] mb-2.5"
         style={{ fontFamily: 'var(--font-display)' }}>Priority</p>
      <div className="flex gap-1.5 flex-wrap">
        {PRIORITIES.map(p => (
          <button
            key={p}
            onClick={() => { setPriority(p); save({ priority: p }) }}
            className={cn(
              'text-[11px] px-3 py-1.5 rounded-lg border font-semibold tracking-wide transition-all duration-150',
              priority === p
                ? PRIORITY_ACTIVE[p]
                : 'bg-transparent border-[rgba(255,255,255,0.06)] text-[#454a5c] hover:border-[rgba(255,255,255,0.12)] hover:text-[#9099b0]'
            )}
          >
            {PRIORITY_LABEL[p]}
          </button>
        ))}
      </div>
    </div>

    {/* Due date */}
    <div>
      <p className="text-[10px] font-semibold text-[#454a5c] uppercase tracking-[1px] mb-2.5"
         style={{ fontFamily: 'var(--font-display)' }}>Due Date</p>
      <input
        type="date"
        value={dueDate}
        onChange={e => { setDueDate(e.target.value); save({ due_date: e.target.value || null }) }}
        className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-[13px] font-medium text-[#f0f0f5] outline-none focus:border-[rgba(124,111,247,0.5)] focus:bg-[rgba(124,111,247,0.05)] transition-all w-full"
      />
    </div>

    {/* Notes */}
    <div>
      <p className="text-[10px] font-semibold text-[#454a5c] uppercase tracking-[1px] mb-2.5"
         style={{ fontFamily: 'var(--font-display)' }}>Notes</p>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        onBlur={() => save({ notes: notes || null })}
        placeholder="Add notes…"
        rows={3}
        className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-[13px] text-[#f0f0f5] placeholder:text-[#454a5c] outline-none focus:border-[rgba(124,111,247,0.5)] focus:bg-[rgba(124,111,247,0.05)] transition-all resize-none font-medium"
      />
    </div>

    {/* Subtasks */}
    <div>
      <p className="text-[10px] font-semibold text-[#454a5c] uppercase tracking-[1px] mb-2.5"
         style={{ fontFamily: 'var(--font-display)' }}>Subtasks</p>
      <div className="space-y-1 mb-3">
        {[...task.subtasks]
          .sort((a, b) => a.position - b.position)
          .map(st => (
            <div key={st.id} className="flex items-center gap-2.5 py-1 group/st">
              <button
                onClick={() => startTransition(() => updateSubtask(st.id, { completed: !st.completed }))}
                className={cn(
                  'w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-150',
                  st.completed
                    ? 'bg-[#7C6FF7] border-[#7C6FF7] shadow-[0_0_6px_rgba(124,111,247,0.4)]'
                    : 'border-[rgba(255,255,255,0.18)] hover:border-[#7C6FF7]'
                )}
              >
                {st.completed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </button>
              <span className={cn(
                'flex-1 text-[12px] font-medium',
                st.completed ? 'line-through text-[#454a5c]' : 'text-[#9099b0]'
              )}>
                {st.title}
              </span>
              <button
                onClick={() => startTransition(() => deleteSubtask(st.id))}
                className="p-1 text-[#454a5c] hover:text-[#f87171] transition-all"
                aria-label="Delete subtask"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
      </div>
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full border border-dashed border-[rgba(255,255,255,0.12)] flex items-center justify-center flex-shrink-0">
          <Plus className="w-2.5 h-2.5 text-[#454a5c]" />
        </div>
        <input
          value={newSubtask}
          onChange={e => setNewSubtask(e.target.value)}
          onKeyDown={handleAddSubtask}
          placeholder="Add subtask… (Enter to save)"
          className="flex-1 bg-transparent text-[12px] font-medium text-[#f0f0f5] placeholder:text-[#454a5c] outline-none"
        />
      </div>
    </div>
  </>
)
```

Note: subtask delete button no longer has `opacity-0 group-hover/st:opacity-100` — it's always visible (touch-friendly).

- [ ] **Step 5: Verify build**

```bash
npm run build
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/task-detail-panel.tsx
git commit -m "feat: task detail panel as bottom sheet on mobile"
```

---

## Task 5: CreateTaskModal → Bottom Sheet on Mobile

**Files:**
- Modify: `components/create-task-modal.tsx`

- [ ] **Step 1: Add `useIsMobile` and `PanInfo` imports**

In `components/create-task-modal.tsx`, add to the existing framer-motion import line:

```tsx
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
```

- [ ] **Step 2: Add hook and drag handler inside the component**

Inside `CreateTaskModal`, after existing state declarations:

```tsx
const isMobile = useIsMobile()

function handleSheetDragEnd(_: PointerEvent, info: PanInfo) {
  if (info.offset.y > 80) handleClose()
}
```

- [ ] **Step 3: Replace the `<motion.div>` modal wrapper with a conditional layout**

Find the `{/* Modal */}` section (the `motion.div` with `fixed left-1/2 top-1/2`) and replace it with:

```tsx
{isMobile ? (
  /* ── Mobile: bottom sheet ── */
  <motion.div
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    exit={{ y: '100%' }}
    drag="y"
    dragConstraints={{ top: 0 }}
    dragElastic={{ top: 0, bottom: 0.25 }}
    onDragEnd={handleSheetDragEnd}
    transition={{ type: 'spring', damping: 32, stiffness: 380, mass: 0.7 }}
    className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[20px] border-t border-[rgba(255,255,255,0.08)]"
    style={{ background: 'rgba(8,8,18,0.98)', backdropFilter: 'blur(40px)' }}
  >
    {/* Drag handle */}
    <div className="flex justify-center pt-3 pb-1">
      <div className="w-8 h-[3px] rounded-full bg-[rgba(255,255,255,0.2)]" />
    </div>
    <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5 pb-8">
      {modalFormContent}
    </form>
  </motion.div>
) : (
  /* ── Desktop: centred modal (unchanged) ── */
  <motion.div
    initial={{ opacity: 0, scale: 0.96, y: 12 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.97, y: 6 }}
    transition={{ type: 'spring', damping: 32, stiffness: 380, mass: 0.7 }}
    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[480px] px-4"
  >
    <div className="rounded-2xl p-[1px]"
         style={{ background: 'linear-gradient(135deg, rgba(124,111,247,0.3), rgba(255,255,255,0.05), rgba(94,158,247,0.15))' }}>
      <form onSubmit={handleSubmit} className="rounded-[15px] p-5 flex flex-col gap-5"
            style={{ background: 'rgba(8,8,18,0.97)', backdropFilter: 'blur(40px)' }}>
        {modalFormContent}
      </form>
    </div>
  </motion.div>
)}
```

- [ ] **Step 4: Extract shared form content into a variable**

Before the `return` in `CreateTaskModal`, add:

```tsx
const modalFormContent = (
  <>
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-[15px] font-bold tracking-tight text-[#f0f0f5]"
          style={{ fontFamily: 'var(--font-display)' }}>
        New Task
      </h2>
      <button type="button" onClick={handleClose}
        className="p-1.5 rounded-lg text-[#454a5c] hover:text-[#9099b0] hover:bg-[rgba(255,255,255,0.05)] transition-all">
        <X className="w-4 h-4" />
      </button>
    </div>

    {/* Title */}
    <input
      ref={titleRef}
      value={title}
      onChange={e => setTitle(e.target.value)}
      placeholder="What needs to be done?"
      required
      className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[15px] font-semibold text-[#f0f0f5] placeholder:text-[#454a5c] outline-none focus:border-[rgba(124,111,247,0.5)] focus:bg-[rgba(124,111,247,0.04)] transition-all"
    />

    {/* Project */}
    {projects.length > 1 && (
      <div>
        <p className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px] mb-2"
           style={{ fontFamily: 'var(--font-display)' }}>Project</p>
        <div className="flex flex-wrap gap-1.5">
          {projects.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProjectId(p.id)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[12px] font-semibold transition-all duration-150',
                projectId === p.id
                  ? 'border-[rgba(255,255,255,0.2)] text-[#f0f0f5]'
                  : 'border-[rgba(255,255,255,0.06)] text-[#454a5c] hover:text-[#9099b0] hover:border-[rgba(255,255,255,0.12)]'
              )}
              style={projectId === p.id ? { background: `${p.color}18` } : undefined}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: p.color, boxShadow: projectId === p.id ? `0 0 5px ${p.color}80` : 'none' }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Priority */}
    <div>
      <p className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px] mb-2"
         style={{ fontFamily: 'var(--font-display)' }}>Priority</p>
      <div className="flex gap-1.5 flex-wrap">
        {PRIORITIES.map(({ value, label, style }) => (
          <button
            key={value}
            type="button"
            onClick={() => setPriority(value)}
            className={cn(
              'px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wide transition-all duration-150',
              priority === value ? PRIORITY_ACTIVE[value] : `bg-transparent ${style} hover:bg-[rgba(255,255,255,0.03)]`
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>

    {/* Due date */}
    <div>
      <p className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px] mb-2"
         style={{ fontFamily: 'var(--font-display)' }}>Due Date <span className="normal-case tracking-normal font-medium text-[#454a5c]">(optional)</span></p>
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#f0f0f5] outline-none focus:border-[rgba(124,111,247,0.5)] focus:bg-[rgba(124,111,247,0.04)] transition-all"
      />
    </div>

    {/* Notes */}
    <div>
      <p className="text-[10px] font-bold text-[#454a5c] uppercase tracking-[1px] mb-2"
         style={{ fontFamily: 'var(--font-display)' }}>Notes <span className="normal-case tracking-normal font-medium text-[#454a5c]">(optional)</span></p>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Any extra details…"
        rows={2}
        className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#f0f0f5] placeholder:text-[#454a5c] outline-none focus:border-[rgba(124,111,247,0.5)] focus:bg-[rgba(124,111,247,0.04)] transition-all resize-none"
      />
    </div>

    {/* Actions */}
    <div className="flex gap-2 pt-1">
      <button
        type="button"
        onClick={handleClose}
        className="flex-1 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[13px] font-semibold text-[#9099b0] hover:bg-[rgba(255,255,255,0.06)] transition-all"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading || !title.trim() || !projectId}
        className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all disabled:opacity-40 hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #7C6FF7 0%, #5E9EF7 100%)', boxShadow: '0 0 20px rgba(124,111,247,0.3)' }}
      >
        {loading ? 'Creating…' : 'Create Task'}
      </button>
    </div>

    {projects.length === 0 && (
      <p className="text-[12px] text-[#f87171] text-center font-medium">
        Create a project first to add tasks.
      </p>
    )}
  </>
)
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/create-task-modal.tsx
git commit -m "feat: create task modal as bottom sheet on mobile"
```

---

## Task 6: TaskRow — Swipe Gestures + Touch Targets

**Files:**
- Modify: `components/task-row.tsx`

- [ ] **Step 1: Update imports**

Replace the existing imports in `components/task-row.tsx`:

```tsx
'use client'
import { useTransition } from 'react'
import { motion, AnimatePresence, useMotionValue, animate, type PanInfo } from 'framer-motion'
import { Check, Trash2 } from 'lucide-react'
import { cn, PRIORITY_LABEL, getTodayString } from '@/lib/utils'
import { ProjectDot } from './project-dot'
import { completeTask, softDeleteTask, restoreTask, hardDeleteTask } from '@/lib/actions/tasks'
import { UndoToast } from './undo-toast'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import { useState, useCallback } from 'react'
import type { Task } from '@/lib/types'
```

- [ ] **Step 2: Add undo state and swipe handlers inside `TaskRow`**

Inside `TaskRow`, add after existing state:

```tsx
const isMobile = useIsMobile()
const x = useMotionValue(0)
const [showUndo, setShowUndo] = useState(false)
const [deletedId, setDeletedId] = useState<string | null>(null)

function handleComplete() {
  startTransition(() => completeTask(task.id, !task.completed))
}

function handleSwipeDelete() {
  setDeletedId(task.id)
  startTransition(() => softDeleteTask(task.id))
  setShowUndo(true)
}

function handleUndo() {
  if (deletedId) startTransition(() => restoreTask(deletedId))
  setShowUndo(false)
}

const handleExpire = useCallback(() => {
  if (deletedId) startTransition(() => hardDeleteTask(deletedId))
  setShowUndo(false)
}, [deletedId])

function handleDragEnd(_: PointerEvent, info: PanInfo) {
  if (info.offset.x > 60) {
    animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 })
    handleComplete()
  } else if (info.offset.x < -60) {
    animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 })
    handleSwipeDelete()
  } else {
    animate(x, 0, { type: 'spring', stiffness: 500, damping: 40 })
  }
}
```

- [ ] **Step 3: Replace the `handleCheck` function**

Remove the existing `handleCheck` and replace with a simplified version that calls `handleComplete`:

```tsx
function handleCheck(e: React.MouseEvent) {
  e.stopPropagation()
  handleComplete()
}
```

- [ ] **Step 4: Wrap the row in a swipe container**

Replace the outermost `<motion.div layout onClick={onClick} ...>` return with:

```tsx
return (
  <>
    <div className="relative overflow-hidden rounded-xl">
      {/* Swipe-right reveal: complete (green) */}
      <div className="absolute inset-0 flex items-center px-4 gap-2"
           style={{ background: '#16a34a' }}>
        <Check className="w-4 h-4 text-white" strokeWidth={3} />
        <span className="text-[11px] font-bold text-white">Complete</span>
      </div>

      {/* Swipe-left reveal: delete (red) */}
      <div className="absolute inset-0 flex items-center justify-end px-4 gap-2"
           style={{ background: '#dc2626' }}>
        <span className="text-[11px] font-bold text-white">Delete</span>
        <Trash2 className="w-4 h-4 text-white" />
      </div>

      {/* Row — slides on top of reveals */}
      <motion.div
        layout
        style={{ x }}
        drag={isMobile ? 'x' : false}
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.1}
        onDragEnd={isMobile ? handleDragEnd : undefined}
        onClick={onClick}
        className={cn(
          'group flex items-center gap-3 px-3.5 rounded-xl cursor-pointer relative bg-transparent',
          'transition-colors duration-150',
          'border border-transparent',
          task.completed
            ? 'opacity-40 hover:opacity-60'
            : 'hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.06)]'
        )}
        style={{ background: 'var(--bg-base, #080812)' }}
      >
        {/* Left accent bar on hover (desktop only) */}
        {!task.completed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-5 bg-[#7C6FF7] rounded-r-full transition-all duration-200 opacity-0 group-hover:opacity-100" />
        )}

        {/* Checkbox — 44px touch target wrapper */}
        <div className="flex items-center justify-center w-[44px] h-[44px] -ml-3 -my-1 flex-shrink-0"
             onClick={handleCheck}>
          <motion.div
            whileTap={{ scale: 0.8 }}
            aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
            className={cn(
              'w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-150',
              task.completed
                ? 'bg-[#7C6FF7] border-[#7C6FF7] shadow-[0_0_10px_rgba(124,111,247,0.5)]'
                : 'border-[rgba(255,255,255,0.18)] hover:border-[#7C6FF7] hover:bg-[rgba(124,111,247,0.1)]'
            )}
          >
            <AnimatePresence>
              {task.completed && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                >
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {showProject && task.project && <ProjectDot color={task.project.color} />}

        <span className={cn(
          'flex-1 text-[13px] font-medium truncate leading-none py-3',
          task.completed ? 'line-through text-[#454a5c]' : 'text-[#d8dce8]'
        )}>
          {task.title}
        </span>

        <div className="flex items-center gap-2 flex-shrink-0">
          {task.priority !== 'none' && PRIORITY_PILL[task.priority] && (
            <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide', PRIORITY_PILL[task.priority])}>
              {PRIORITY_LABEL[task.priority]}
            </span>
          )}
          {formattedDate && !task.completed && (
            <span className={cn(
              'text-[11px] font-medium',
              isOverdue ? 'text-red-400' : 'text-[#454a5c]'
            )}>
              {isOverdue ? '⚠ Overdue' : formattedDate}
            </span>
          )}
        </div>
      </motion.div>
    </div>

    {showUndo && (
      <UndoToast message="Task deleted" onUndo={handleUndo} onExpire={handleExpire} />
    )}
  </>
)
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/task-row.tsx
git commit -m "feat: swipe-to-complete and swipe-to-delete on mobile task rows"
```

---

## Task 7: QuickAdd — Tappable Add Button

**Files:**
- Modify: `components/quick-add.tsx`

- [ ] **Step 1: Replace the file**

```tsx
// components/quick-add.tsx
'use client'
import { useState, useRef } from 'react'
import { Plus, CornerDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickAddProps {
  placeholder?: string
  onAdd: (title: string) => Promise<void>
}

export function QuickAdd({ placeholder = 'Add a task…', onAdd }: QuickAddProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit() {
    if (!value.trim() || loading) return
    setLoading(true)
    await onAdd(value.trim())
    setValue('')
    setLoading(false)
  }

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      await handleSubmit()
    }
    if (e.key === 'Escape') {
      setValue('')
      inputRef.current?.blur()
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 cursor-text',
        focused
          ? 'bg-[rgba(124,111,247,0.06)] border-[rgba(124,111,247,0.3)] shadow-[0_0_0_3px_rgba(124,111,247,0.08)]'
          : 'bg-[rgba(255,255,255,0.02)] border-dashed border-[rgba(255,255,255,0.08)] hover:border-[rgba(124,111,247,0.2)] hover:bg-[rgba(255,255,255,0.03)]'
      )}
    >
      <div className={cn(
        'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border',
        focused
          ? 'border-[rgba(124,111,247,0.5)] bg-[rgba(124,111,247,0.12)]'
          : 'border-dashed border-[rgba(255,255,255,0.12)]'
      )}>
        <Plus className={cn('w-2.5 h-2.5 transition-colors', focused ? 'text-[#7C6FF7]' : 'text-[#454a5c]')} />
      </div>

      <input
        ref={inputRef}
        id="quick-add-input"
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[13px] font-medium text-[#f0f0f5] placeholder:text-[#454a5c] outline-none"
      />

      {focused && value && (
        <button
          type="button"
          onMouseDown={e => e.preventDefault()}
          onClick={handleSubmit}
          disabled={loading}
          aria-label="Add task"
          className="flex items-center justify-center w-6 h-6 rounded-lg bg-[rgba(124,111,247,0.2)] text-[#7C6FF7] flex-shrink-0 transition-all hover:bg-[rgba(124,111,247,0.35)] disabled:opacity-40"
        >
          <CornerDownLeft className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/quick-add.tsx
git commit -m "feat: add tappable submit button to QuickAdd"
```

---

## Done

All 7 tasks complete. The feature is fully built when all commits are in place. Test on a real mobile device (or Chrome DevTools device emulation) by:

1. **Bottom nav:** FAB opens task creation; Settings tab shows email + sign out
2. **Task detail:** Tap a task → sheet rises from bottom; drag down to dismiss
3. **Create task:** Tap FAB or "Add Task" button → bottom sheet on mobile
4. **Swipe complete:** Swipe any task row right past halfway → turns green, completes
5. **Swipe delete:** Swipe any task row left past halfway → turns red, deletes with undo toast
6. **QuickAdd:** Focus the quick-add input, type something → purple button appears; tap it to add
