# Handoff: Focus — Mobile Responsive Redesign

## Overview
This package contains a high-fidelity interactive prototype of the Focus todo app, redesigned for mobile. The prototype covers all major screens: Login, Today, All Tasks, Projects, Project Detail, and Stats — plus modals for creating tasks and viewing task detail.

## About the Design Files
The files in this bundle are **design references created in HTML/React** — prototypes showing intended look and behavior, not production code to ship directly. The task is to **recreate these designs inside the existing Next.js + Tailwind + Supabase codebase**, using its established patterns (server components, client components, Framer Motion, existing actions, etc.).

The repo is at: https://github.com/P4R0S/Todo  
Live deployment: https://todo-drab-five-70.vercel.app/login

## Fidelity
**High-fidelity.** These are pixel-close mockups with final colors, typography, spacing, and interactions. Recreate the UI as closely as possible using the existing codebase's libraries and component patterns. Where exact parity isn't possible (e.g. server-rendered data), match the visual and interaction intent.

---

## Screens

### 1. Login (`/login`)
- **Purpose:** Email/password auth, with a "Continue as guest" shortcut and sign-up toggle.
- **Layout:** Full-height flex column, `padding: 32px 24px`. Content centered vertically.
- **Components:**
  - Logo mark: `52×52px` rounded square (`border-radius: 14px`), gradient `#7C6FF7 → #5E9EF7`, clock SVG icon, `box-shadow: 0 0 24px rgba(124,111,247,0.45)`
  - Heading: Syne, 28px, weight 800, color `#f0f0f5`
  - Subheading: Plus Jakarta Sans, 14px, color `#9099b0`
  - Inputs: `background: rgba(255,255,255,0.03)`, border `rgba(255,255,255,0.09)`, `border-radius: 12px`, `padding: 12px 14px`, focus border `rgba(124,111,247,0.5)`
  - Primary button: gradient `#7C6FF7 → #5E9EF7`, `border-radius: 14px`, `padding: 14px`, `box-shadow: 0 0 24px rgba(124,111,247,0.35)`
  - Secondary button: border `rgba(255,255,255,0.08)`, `border-radius: 14px`, color `#9099b0`
  - Toggle link (sign in / sign up): color `#7C6FF7`, weight 600

### 2. Today (`/today`)
- **Purpose:** Tasks due today, with a progress bar and completion tracking.
- **Layout:** Scrollable column, `padding: 0 16px`. Header at top, task list below.
- **Components:**
  - Date label: Syne, 11px, weight 600, `#454a5c`, uppercase, `letter-spacing: 0.06em`
  - Screen title: Syne, 26px, weight 800, `#f0f0f5`
  - Progress bar: `height: 4px`, track `rgba(255,255,255,0.05)`, fill gradient `#7C6FF7 → #5E9EF7`, `box-shadow: 0 0 8px rgba(124,111,247,0.5)`. Animate width on change with `cubic-bezier(0.16,1,0.3,1)`.
  - Progress label: `11px`, `#454a5c` left / `#7C6FF7` right (percentage)
  - Section headers: 11px Syne, `#454a5c`, uppercase, `letter-spacing: 0.08em`, with count pill
  - Task rows: see TaskRow spec below
  - FAB: `52×52px` circle, gradient `#7C6FF7 → #5E9EF7`, `box-shadow: 0 0 24px rgba(124,111,247,0.5)`, fixed bottom-right (`right: 20px, bottom: 88px`)

### 3. All Tasks (`/all`)
- **Purpose:** All tasks across projects, with filter tabs and grouped by project.
- **Layout:** Same as Today. Filter tabs below header.
- **Filter tabs:** 3 options (All / Active / Completed), inside a rounded pill container `background: rgba(255,255,255,0.02)`, active tab `background: rgba(124,111,247,0.18)`, active color `#7C6FF7`
- **Grouping:** Each project gets a color dot header + count pill, tasks listed below

### 4. Projects (`/projects`)
- **Purpose:** Overview of all projects with per-project progress.
- **Layout:** Vertical card list, `gap: 10px`
- **Project card:**
  - `border-radius: 16px`, `padding: 16px`, border `rgba(255,255,255,0.06)`, background `rgba(255,255,255,0.02)`
  - Left: colored icon square (`36×36px`, `border-radius: 10px`, `background: {color}18`)
  - Project name: Syne, 15px, weight 700, `#f0f0f5`
  - Subtitle: 11px, `#454a5c`, "N tasks · N done"
  - Right: overdue badge (danger red) if applicable
  - Bottom: thin progress bar (height 3px) colored with project color

### 5. Project Detail (`/projects/[id]`)
- **Purpose:** Task list scoped to one project.
- **Layout:** Header with back nav + project identity + progress bar, then scrollable task list
- **Back button:** chevron left + "Projects" label, `#454a5c`, 13px
- **Project header:** `40×40px` icon, Syne 20px weight 800 name, progress bar colored with project color

### 6. Stats
- **Purpose:** Completion overview — ring chart, per-project bars, priority breakdown.
- **SVG ring:** `120×120px`, `r=52`, stroke-width 10, track `rgba(255,255,255,0.05)`, fill gradient `#7C6FF7 → #5E9EF7`, `stroke-linecap: round`. Animate `stroke-dashoffset` on mount with `1.2s cubic-bezier(0.16,1,0.3,1)`. Center label: percentage (Syne 22px 800) + "done" (9px uppercase).
- **Stat lines:** label `#454a5c` 12px / value Syne 16px 800, colored by status (success/danger/warning)
- **Per-project bars:** height 3px, colored with project color
- **Priority table:** label (colored) / mini bar / count

---

## TaskRow Component
This is the core interactive element. Implement in the existing `task-row.tsx`.

**Visual (resting state):**
- `min-height: 52px`, `border-radius: 14px`, `padding: 0 14px`, `border: 1px solid rgba(255,255,255,0.06)`, `background: #08080f`
- Left: circular checkbox (`22×22px`, `border-radius: 50%`). Unchecked: `border: 1.5px solid rgba(255,255,255,0.22)`. Checked: `background: #7C6FF7`, `box-shadow: 0 0 12px rgba(124,111,247,0.5)`, white checkmark SVG.
- Project color dot (7×7px) if showing project context
- Title: Plus Jakarta Sans 13.5px weight 500, `#f0f0f5`. Completed: `#454a5c` + strikethrough.
- Right: priority pill + due date label (or "Late" in red if overdue)

**Completed state:**
- Background: `rgba(255,255,255,0.015)`, border: `rgba(255,255,255,0.04)`
- Priority badge hidden, date hidden
- Red trash button appears on the right (`28×28px`, `border-radius: 8px`, `background: rgba(248,113,113,0.08)`, border `rgba(248,113,113,0.18)`)

**Swipe gestures (mobile):**
- Swipe right → complete: reveal green (`#16a34a`) background with checkmark. Trigger at `dx > 65px`.
- Swipe left → delete: reveal red (`#dc2626`) background with trash icon. Trigger at `dx < -65px`.
- Snap back with `cubic-bezier(0.16,1,0.3,1)` if not triggered.
- Reveal backgrounds only render when `|dx| > 5px` to avoid bleed-through.

---

## Bottom Navigation
Replace the sidebar on mobile with a fixed bottom nav bar.

- 4 tabs: **Today** (bolt icon) / **All** (list icon) / **Projects** (monitor icon) / **Stats** (bar chart icon)
- Height: ~72px, `border-top: 1px solid rgba(255,255,255,0.06)`, `background: rgba(4,4,10,0.95)`, `backdrop-filter: blur(20px)`
- Active tab: icon + label in `#7C6FF7`, small dot indicator (`4×4px`) below label
- Inactive: `#454a5c`, opacity 0.6

---

## Bottom Sheet Modals
On mobile, replace centered modals with bottom sheets.

- Slides up from bottom: `transform: translateY(100%) → translateY(0)` with `cubic-bezier(0.16,1,0.3,1) 0.42s`
- Drag handle: `36×4px` pill, `rgba(255,255,255,0.18)`, centered at top
- Drag-to-dismiss: if drag offset Y > 80px, close the sheet
- Overlay: `background: rgba(0,0,0,0.65)`, `backdrop-filter: blur(8px)`
- Sheet background: `rgba(8,8,18,0.98)`, `backdrop-filter: blur(40px)`
- `border-radius: 20px 20px 0 0`
- Header: 11px Syne uppercase label + close (×) button

---

## Screen Transitions
When navigating between tabs/screens, animate the incoming screen:
- Slide in from `translateX(24px)` + `opacity: 0` → `translateX(0)` + `opacity: 1`
- Duration: `0.35s cubic-bezier(0.16,1,0.3,1)` for transform, `0.25s ease` for opacity
- Forward nav: slide from right (+24px); back nav: slide from left (−24px)

---

## Design Tokens

| Token | Value |
|---|---|
| Background | `#04040a` |
| Card background | `#08080f` |
| Accent purple | `#7C6FF7` |
| Accent blue | `#5E9EF7` |
| Text primary | `#f0f0f5` |
| Text secondary | `#9099b0` |
| Text muted | `#454a5c` |
| Surface 1 | `rgba(255,255,255,0.02)` |
| Surface 2 | `rgba(255,255,255,0.04)` |
| Border | `rgba(255,255,255,0.06)` |
| Border strong | `rgba(255,255,255,0.12)` |
| Success | `#34d399` |
| Danger | `#f87171` |
| Warning | `#fbbf24` |
| Font body | Plus Jakarta Sans |
| Font display | Syne |
| Radius card | `14px` |
| Radius button | `10–14px` |
| Ease spring | `cubic-bezier(0.16,1,0.3,1)` |

**Priority colors:**

| Priority | Text | Background | Border |
|---|---|---|---|
| urgent | `#f87171` | `rgba(248,113,113,0.1)` | `rgba(248,113,113,0.25)` |
| high | `#fb923c` | `rgba(251,146,60,0.1)` | `rgba(251,146,60,0.25)` |
| medium | `#fbbf24` | `rgba(251,191,36,0.1)` | `rgba(251,191,36,0.25)` |
| low | `#38bdf8` | `rgba(56,189,248,0.1)` | `rgba(56,189,248,0.25)` |

---

## Key Bug Fixes Identified
Two bugs were found in the prototype process — check if they exist in the real codebase:

1. **Date arithmetic** — `new Date(dateObj + milliseconds)` does string concatenation in JS. Always use `new Date(dateObj.getTime() + milliseconds)`.
2. **Opacity on swipeable rows** — applying `opacity` to a row with absolutely-positioned swipe reveals bleeds the colored background through. Instead, apply faded styling directly to child elements (text color, icon opacity), and only render swipe reveal divs when `|dragOffset| > 5px`.

---

## Files in This Package

| File | Description |
|---|---|
| `Focus Mobile Prototype.html` | Open in browser — fully interactive prototype |
| `focus-data.jsx` | App context, mock data, design tokens, TaskRow, Sheet, FAB |
| `focus-screens.jsx` | All screen components |
| `focus-app.jsx` | Root app, bottom nav, create/detail sheets |
| `ios-frame.jsx` | iPhone bezel wrapper (design reference only) |

---

## How to Use with Claude Code
1. Open your repo in Claude Code
2. Drop this zip into the project or paste the README
3. Say: _"Implement the mobile redesign described in README.md. Use the HTML prototype files as visual reference. Keep all existing server actions, Supabase queries, and auth — just update the UI layer."_
