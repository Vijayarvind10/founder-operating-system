# Cortex AI — Interface Design System

## Direction & Feel

**Product:** Founder Operating System — a command center for founders monitoring company health, team wellbeing, and outreach.

**Who:** A founder between meetings, needing signal in 10 seconds. High-stakes, time-poor, action-oriented.

**Feel:** Amber phosphor terminal. Dark server room. Mission control. Dense but structured — every pixel earning its place. Not "clean and modern" — cold and precise, like a monitoring screen you trust with your company.

---

## Depth Strategy

**Borders-only.** No box shadows. Cards are defined by a 1px border on three sides (`#1c1c20`) and a 2px semantic left-border accent. This reads as a technical, precise interface — appropriate for a tool that handles real company data.

---

## Color Tokens

```css
/* Canvas */
--canvas:       #07070a   /* near-black base */
--surface:      #0f0f12   /* card / sidebar elevation */
--surface-high: #1c1c20   /* hover states, secondary buttons, inputs */
--surface-pop:  #2a2a30   /* muted accent — flat trend border */

/* Text hierarchy */
--ink:          #f0ede8   /* primary text */
--ink-2:        #6b6b70   /* secondary / body copy */
--ink-3:        #3a3a3f   /* metadata, eyebrow labels */
--ink-ghost:    #2a2a30   /* disabled / placeholder */

/* Brand & semantic */
--signal:       #f59e0b   /* amber — brand, up-trend, active nav, CTA */
--signal-dim:   #92400e   /* amber border for badges */
--danger:       #f87171   /* red — down-trend, high-risk, destructive */
--danger-dim:   #7f1d1d   /* red border */
--warn:         #f97316   /* orange — medium risk, alerts */
--warn-dim:     #7c2d12   /* orange border */
--healthy:      #34d399   /* green — healthy, connected, approved */
--healthy-dim:  #065f46   /* green border */
--info:         #60a5fa   /* blue — informational alerts */
```

---

## Typography

| Role        | Font             | Size      | Weight | Tracking       |
|-------------|------------------|-----------|--------|----------------|
| Display/H1  | Syne             | 3xl (30px)| 700    | default        |
| Card title  | Syne             | sm (14px) | 700    | default        |
| Nav label   | Syne             | sm (14px) | 600    | default        |
| Body copy   | Geist (sans)     | sm (14px) | 400    | default        |
| Eyebrow     | JetBrains Mono   | 10px      | 400    | 0.15em         |
| Section tag | JetBrains Mono   | 9px       | 400    | 0.12em         |
| Data/metric | JetBrains Mono   | varies    | 400–500| tabular-nums   |
| Badge/label | JetBrains Mono   | 9–10px    | 500    | 0.1em          |

**Eyebrow pattern:** `// SECTION NAME` in JetBrains Mono, `#3a3a3f`, `letterSpacing: "0.15em"` — used above every page H1 and major card heading.

---

## Spacing

Base unit: **4px (Tailwind default)**

| Context           | Value         |
|-------------------|---------------|
| Card padding      | p-5 (20px)    |
| Card padding tight| p-4 (16px)    |
| Section gap       | gap-8 (32px)  |
| Card internal gap | gap-4 (16px)  |
| Nav item padding  | py-2 px-2.5   |
| Badge padding     | px-2.5 py-0.5 |

---

## Border Radius

`rounded` = `0.375rem` (6px) — used on all cards, nav items, buttons, badges.
`rounded-full` — dots, avatars, progress bars only.

---

## Signature Pattern — Semantic Left-Border

Every data card uses a **2px colored left-border** to encode meaning at a glance. The other three sides use `1px solid #1c1c20`.

```tsx
// Metric cards — trend direction
border: "1px solid #1c1c20",
borderLeft: `2px solid ${accentColor}`,
// accentColor: #f59e0b (up) | #f87171 (down) | #2a2a30 (flat)

// Team cards — risk level
borderLeft: `2px solid ${cfg.barColor}`,
// barColor: #f87171 (high) | #f97316 (medium) | #34d399 (low)

// Summary stat cards — semantic by content
// burnout: #f97316 | health: #34d399 | neutral: #2a2a30
```

---

## Navigation — Active State

Nav lives in `src/components/nav-links.tsx` (client component using `usePathname`).

```tsx
// Active item
paddingLeft: "8px",                          // 10px - 2px border compensation
borderLeft: "2px solid #f59e0b",
backgroundColor: "#1c1c20",
color: "#f0ede8",
// icon: color: "#f59e0b"

// Inactive item
borderLeft: "2px solid transparent",         // maintains layout alignment
color: "#6b6b70",
backgroundColor: "transparent",
// hover → color: #f0ede8, backgroundColor: #1c1c20
```

---

## Card Anatomy

```
┌─╴2px accent ─────────────────────────────┐
│  EYEBROW LABEL (JetBrains Mono, 9px)      │ ← #3a3a3f
│                                           │
│  Card Title (Syne, bold)                  │ ← #f0ede8
│  Supporting text or value                 │ ← #6b6b70 or metric color
│                                           │
│  ─── divider (borderColor: #1c1c20) ───   │
│  Footer content / actions                 │
└───────────────────────────────────────────┘
border: 1px solid #1c1c20
backgroundColor: #0f0f12
```

---

## Live Status Indicators

**Pulsing dot** — used for "connected" / "agents online" status:
```tsx
<span className="relative flex h-2 w-2">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
        style={{ backgroundColor: "#34d399" }} />
  <span className="relative inline-flex h-2 w-2 rounded-full"
        style={{ backgroundColor: "#34d399" }} />
</span>
```

---

## Badge Pattern

```tsx
// Semantic badges (status, agent tag, etc.)
className="rounded border px-2.5 py-0.5 text-[9px] font-medium"
style={{
  color: textColor,           // e.g. #f59e0b
  borderColor: borderColor,   // e.g. #92400e
  backgroundColor: bgColor,   // e.g. rgba(245,158,11,0.06)
  fontFamily: "var(--font-jetbrains-mono)",
}}
```

---

## Animation

**Mount:** `animate-fade-up` (custom — opacity 0→1, translateY 10px→0, 500ms cubic-bezier(0.16,1,0.3,1))

**Stagger:** `animationDelay: \`${i * 60}ms\`` — used on all grid/list items.

**Transitions:** `transition-colors` at 150ms — hover states only. No layout transitions.

No spring/bounce. No dramatic entrance animations for utility elements.

---

## Page Structure

Every page follows:
```
<section className="flex flex-col gap-8">
  <header>
    <p>// EYEBROW</p>       ← JetBrains Mono, #3a3a3f, 0.15em tracking
    <h1>Page Title</h1>     ← Syne, bold, #f0ede8
    <p>Description</p>      ← Geist, #6b6b70
  </header>
  {/* content */}
</section>
```

---

## Sidebar Layout

- **Background:** `#0f0f12` (one step above canvas `#07070a`)
- **Width:** `w-56` (224px), fixed, `shrink-0`
- **Border:** `border-r` at `#1c1c20`
- **Dot-grid pattern:** content area only (via `backgroundImage` radial-gradient in layout)
- **Nav padding:** `px-4` on aside, nav items handle their own horizontal padding

---

## What Not To Do

- No `text-slate-*` Tailwind utilities — use inline `style={{ color: "..." }}` with tokens above
- No box shadows — borders only for depth
- No multiple accent hues — amber (#f59e0b) is the only brand color; red/orange/green are semantic only
- No mixed radius values — `rounded` everywhere, `rounded-full` for dots only
- No different sidebar hue — same hue family, only lightness shift
