# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Mandatory Pre-Work

**Always read `common.md` before modifying any file.** It is the authoritative source for product vision, agent boundaries, tool access rules, and UI routes. Violating the tool access restrictions defined there (e.g. giving the People Coach Agent access to sales data) is an architectural error.

## Commands

```bash
npm run dev          # start Next.js dev server on :3000
npm run build        # production build (runs tsc + next build)
npm run lint         # ESLint

npx tsc --noEmit     # type-check without emitting — run this after every change

# Database
npx prisma generate              # regenerate client after schema changes
npx prisma migrate dev --name <name>   # create and apply a migration
npm run db:seed                  # populate DB from prisma/seed.ts

# Playwright browsers (one-time, required before browser tool works)
npx playwright install chromium
```

There are no automated tests. Type-check with `npx tsc --noEmit` is the verification step.

## Architecture

### Request Flow

Every user query enters through `src/lib/agents/router.ts → routeQuery()`:
1. A Haiku classifier call (`generateObject`) picks one of three agents.
2. An `AgentTracer` is instantiated and `.start()` called to open a LangSmith run.
3. The selected agent runs with `tracer.callbacks()` injected — these are the `onStepFinish`/`onFinish` hooks the AI SDK accepts.
4. `tracer.finish()` emits a structured JSON log line and closes the LangSmith run.

### Agents (`src/lib/agents/`)

Each agent is a module exporting `run<Name>Agent(query, callbacks?)` plus exported constants `<NAME>_MODEL` and `<NAME>_SYSTEM_PROMPT` (consumed by the router for trace metadata).

| Agent | Model | Tools | `stopWhen` |
|---|---|---|---|
| Company Health | claude-sonnet-4-6 | Analytics, Sales, GitHub Tasks, Browser (3 fns) | stepCountIs(8) |
| People Coach | claude-sonnet-4-6 | HR | stepCountIs(4) |
| Nudging | claude-sonnet-4-6 | DB-backed notifications (3 tools) | stepCountIs(5) |

The router classifier uses `claude-haiku-4-5-20251001`.

### Tools (`src/lib/tools/`)

- `analytics.ts`, `sales.ts`, `hr.ts`, `notifications.ts` — static mock data; each returns an object with a `reportGeneratedAt` timestamp and an `alerts[]` array pre-computed for agent consumption.
- `tasks.ts` — **live** GitHub REST API. Reads `GITHUB_PERSONAL_ACCESS_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME` from env. GitHub responses are cached 5 minutes via `next: { revalidate: 300 }`.
- `browser.ts` — Playwright (headless Chromium). Three functions: `checkPageHealth`, `getPageContent`, `inspectSiteStructure`. Each call launches and closes its own browser; requires `npx playwright install chromium` once.

### Database (`prisma/` + `src/lib/db/`)

Prisma v7 with the new `prisma-client` generator — **not** `prisma-client-js`. The generated client is in `src/generated/prisma/client.ts` (no `index.ts`), so all imports must be `from "@/generated/prisma/client"`, not `from "@/generated/prisma"`.

The Prisma singleton (`src/lib/prisma.ts`) uses the `@prisma/adapter-pg` driver adapter; `new PrismaClient()` with no arguments will fail — always pass `{ adapter }`.

Three tables: `nudges`, `employee_insights`, `system_alerts`. `src/lib/db/nudge-actions.ts` contains all Server Actions for the nudges feature, each calling `revalidatePath("/nudges")` after mutations.

### Observability (`src/lib/observability/`)

`AgentTracer` injects AI SDK callbacks and collects per-step data:
- Token fields from `LanguageModelUsage` are `inputTokens` / `outputTokens` (not `promptTokens`/`completionTokens`).
- Tool call fields are `.input` (not `.args`) and `.output` (not `.result`).
- Callbacks use `(event: unknown)` to avoid TS contravariance errors caused by the AI SDK's tool-parameterised generics.

LangSmith is opt-in: set `LANGSMITH_API_KEY` in `.env` to activate. Console JSON logging is always on.

### UI (`src/app/` + `src/components/`)

Next.js 16, App Router. The persistent sidebar lives in `src/app/layout.tsx`. Pages are server components; interactive parts are `"use client"` components under `src/components/`. The nudges page is the only route with a client component (`nudge-list.tsx`) that calls Server Actions directly.

Prisma `Date` objects cannot cross the server/client boundary — convert with `.toISOString()` before passing to client components (see `NudgeRow` in `nudge-actions.ts`).

shadcn components are in `src/components/ui/`. Import from `@/components/ui/<name>`, not from `radix-ui` directly.

### MCP Servers (`.mcp.json`)

Two servers are configured for Claude Code:
- **GitHub** — `docker run ghcr.io/github/github-mcp-server` (read-only, `issues` + `pull_requests` + `actions` toolsets)
- **Playwright** — `npx @playwright/mcp@latest --isolated`

### Environment Variables

```
DATABASE_URL                     # PostgreSQL connection string
GITHUB_PERSONAL_ACCESS_TOKEN     # scopes: repo, read:org
GITHUB_REPO_OWNER
GITHUB_REPO_NAME
STAGING_URL                      # optional, for browser health checks
LANGSMITH_API_KEY                # optional — disables LangSmith tracing if unset
LANGSMITH_ENDPOINT               # defaults to https://api.smith.langchain.com
LANGSMITH_PROJECT                # defaults to "founder-os"
```

## Key Invariants

- **Tool access is strictly enforced per agent** — do not add tools to an agent that `common.md` does not assign to it.
- **The Nudging Agent is human-in-the-loop** — its tools never auto-approve; all status changes require explicit founder action.
- **Prisma client import path** — always `@/generated/prisma/client`, never `@/generated/prisma`.
- **AI SDK v6** — use `inputSchema` (not `parameters`) on tools, and `stopWhen: stepCountIs(n)` (not `maxSteps`).
