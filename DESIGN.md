# Cortex AI — Design & Infrastructure Reference

> Living document. Update this as decisions are made. Use it as the source of truth before touching any UI or infra work.

---

## Brand Identity

| Token | Value |
|---|---|
| **Product name** | Cortex AI |
| **Tagline** | AI Command Center for Founders |
| **Logo icon** | `BrainCircuit` from lucide-react |
| **Primary accent** | Indigo (`indigo-500`, `indigo-600`) |
| **Demo mode color** | Violet / Indigo gradient |
| **Success / up trend** | Emerald (`emerald-600`) |
| **Warning / alert** | Amber (`amber-500`) |
| **Error / down trend** | Rose (`rose-500`) |

---

## Design Principles

1. **Clarity first** — First-time visitors must immediately understand what the product does. Always show the 3-agent capability strip in demo mode.
2. **AI is visible** — Surface AI provenance with badges (`AI Generated`), sparkle icons, and agent attribution labels.
3. **Human-in-the-loop is sacred** — Never suggest automation for the Nudging Agent. Approval UI must always be present and prominent.
4. **Demo mode = full experience** — The demo should feel identical to the live product. Never hide features behind a paywall banner.
5. **Progressive disclosure** — Show the summary first, details on demand. Avoid wall-of-text layouts.

---

## Layout System

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (w-64, dark gradient)  │  Main content      │
│  slate-900 → indigo-950         │  slate-50 bg        │
│                                 │  px-10 py-10        │
│  - Logo + tagline               │                     │
│  - 3 agents active pill         │  <page content>     │
│  - Nav with icons               │                     │
│  - Demo Mode badge              ├─────────────────────│
│  - Agent list footer            │  Footer (SystemStatus)│
└─────────────────────────────────────────────────────┘
```

### Sidebar colors
- Background: `bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950`
- Nav links: `text-slate-400 hover:bg-white/10 hover:text-white`
- Active pill: `bg-white/5 ring-1 ring-white/10`

---

## Component Patterns

### Metric Cards
- 4-column grid on `lg`, 2-column on `md`, 1 on mobile
- Each card has: icon (top-right, `bg-slate-100`), large value, change text, trend indicator
- Trend indicator: arrow icon + color (emerald/rose/slate)

### Agent Capability Strip (Demo Mode)
- Only shown when `demoMode === true`
- 3-column grid: Company Health / People Coach / Nudging
- Each card: colored bg, white icon container, name, 1-line description
- Link to GitHub repo top-right

### AI Daily Briefing
- `Sparkles` icon in card title
- `AI Generated` badge (indigo)
- Numbered priority list (indigo circle number badges)

### Alerts
- Color dot severity: rose (critical) / amber (warning) / blue (info)
- Position 0 = critical, 1 = warning, 2+ = info

### Buttons
- Primary CTA: `bg-indigo-600 hover:bg-indigo-700` with `Sparkles` icon
- Destructive: standard shadcn destructive

---

## Iteration Roadmap

### Next: UX improvements
- [ ] Active nav link highlight (detect current route with `usePathname`)
- [ ] Skeleton loaders on metric cards while `isPending`
- [ ] Animate metric card values with a count-up on load
- [ ] Mobile responsive: collapsible sidebar (hamburger menu)
- [ ] Toast notifications after agent actions

### Next: Product depth
- [ ] `/nudges` page: show agent attribution on each draft
- [ ] `/teams` page: People Coach Agent output (HR signals)
- [ ] `/connections` page: API key setup wizard (GitHub, LangSmith)
- [ ] Chat interface for ad-hoc agent queries

### Next: Infra
- [ ] Add `DATABASE_URL` to Vercel env → enable Nudges page
- [ ] Set `ANTHROPIC_API_KEY` in Vercel → switch from demo to live agents
- [ ] LangSmith tracing dashboard for observability
- [ ] Vercel Analytics + Speed Insights (free tier, enable in dashboard)
- [ ] Custom domain via Vercel Settings → Domains

---

## Infrastructure

### Vercel Deployment
- **Repo**: `Vijayarvind10/founder-operating-system` on GitHub
- **Branch**: `main` (auto-deploy on push)
- **Build command**: `npm run build` (Next.js 16, Turbopack)
- **Demo URL**: `founder-operating-system-git-main-vijayarvind10s-projects.vercel.app`

### Environment Variables (Vercel)

| Variable | Required for | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Live agents | Without it, demo mode activates automatically |
| `DATABASE_URL` | `/nudges` page | Supabase Transaction pooler URL (port 6543) |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | Tasks tool | Scopes: `repo`, `read:org` |
| `GITHUB_REPO_OWNER` / `GITHUB_REPO_NAME` | Tasks tool | |
| `LANGSMITH_API_KEY` | Observability | Optional |
| `STAGING_URL` | Browser health checks | Optional |

### Database
- **Provider**: Supabase (PostgreSQL)
- **ORM**: Prisma v7 (`prisma-client` generator, NOT `prisma-client-js`)
- **Client import**: always `@/generated/prisma/client` (NOT `@/generated/prisma`)
- **Migrations**: run `prisma migrate deploy` with the **direct** connection URL (port 5432)
- **Seeding**: `npm run db:seed` to populate nudges/employee_insights/system_alerts

### Key Invariant: `/nudges` page
- Has `export const dynamic = "force-dynamic"` to prevent build-time DB connection
- Without this, Vercel build fails with `PrismaClientKnownRequestError P1001`

---

## File Map (UI-relevant)

```
src/
  app/
    layout.tsx              # Sidebar, nav, AgentStatusProvider
    page.tsx                # Dashboard server component
    nudges/page.tsx         # Nudges page (force-dynamic)
    actions/demo-data.ts    # Server action: loadDemoData()
  components/
    dashboard-client.tsx    # Main dashboard UI (client component)
    demo-mode-badge.tsx     # Sidebar badge when ANTHROPIC_API_KEY unset
    agent-status.tsx        # Context + SystemStatus footer
    nudges/nudge-list.tsx   # Nudge approval UI
    ui/                     # shadcn components
  lib/
    company-health.ts       # Snapshot types + mock data
    demo-mode.ts            # isDemoMode() helper
```
