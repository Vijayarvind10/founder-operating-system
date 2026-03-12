"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CompanyHealthSnapshot, Metric } from "@/lib/company-health"
import { loadDemoData } from "@/app/actions/demo-data"
import { useAgentStatus } from "@/components/agent-status"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  RefreshCw,
  Users,
  GitCommit,
  ActivitySquare,
  MessageSquare,
  HeartPulse,
  Sparkles,
  AlertTriangle,
  Info,
  BrainCircuit,
  Zap,
  ArrowUpRight,
} from "lucide-react"

type DashboardClientProps = {
  initialSnapshot: CompanyHealthSnapshot
  demoMode?: boolean
}

// Maps metric index to a relevant icon
const METRIC_ICONS = [DollarSign, RefreshCw, Users, GitCommit]

function TrendIndicator({ trend }: { trend: Metric["trend"] }) {
  if (trend === "up")
    return (
      <span className="flex items-center gap-1 text-emerald-600 font-medium">
        <TrendingUp className="h-3.5 w-3.5" />
        Up
      </span>
    )
  if (trend === "down")
    return (
      <span className="flex items-center gap-1 text-rose-500 font-medium">
        <TrendingDown className="h-3.5 w-3.5" />
        Down
      </span>
    )
  return (
    <span className="flex items-center gap-1 text-slate-400">
      <Minus className="h-3.5 w-3.5" />
      Flat
    </span>
  )
}

const AGENT_CAPABILITIES = [
  {
    icon: ActivitySquare,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    ring: "ring-indigo-100",
    name: "Company Health Agent",
    description:
      "Monitors revenue, sales pipeline, and engineering velocity. Delivers a daily AI briefing to the founder.",
  },
  {
    icon: HeartPulse,
    color: "text-rose-500",
    bg: "bg-rose-50",
    ring: "ring-rose-100",
    name: "People Coach Agent",
    description:
      "Analyses HR signals, flags burnout risk, and suggests coaching actions for team leads.",
  },
  {
    icon: MessageSquare,
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-100",
    name: "Nudging Agent",
    description:
      "Drafts personalised outreach and internal messages. Nothing sends without your explicit approval.",
  },
]

export default function DashboardClient({
  initialSnapshot,
  demoMode = false,
}: DashboardClientProps) {
  const { setLastOperation } = useAgentStatus()
  const [snapshot, setSnapshot] =
    React.useState<CompanyHealthSnapshot>(initialSnapshot)
  const [isPending, startTransition] = React.useTransition()
  const deferredSnapshot = React.useDeferredValue(snapshot)

  const handleLoadDemo = () => {
    startTransition(async () => {
      const result = await loadDemoData()
      setSnapshot(result.snapshot)
      setLastOperation(result.operation)
    })
  }

  return (
    <section className="flex flex-col gap-8">

      {/* ── Agent capabilities hero (demo mode only) ───────────────────────── */}
      {demoMode && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-500" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                  What Cortex AI Does
                </span>
              </div>
              <h2 className="mt-1.5 text-xl font-semibold text-slate-900">
                Three AI agents. One command center.
              </h2>
              <p className="mt-1 text-sm text-slate-500 max-w-lg">
                Cortex AI runs continuously in the background — monitoring your
                metrics, coaching your team, and drafting communications —
                without you lifting a finger.
              </p>
            </div>
            <a
              href="https://github.com/Vijayarvind10/founder-operating-system"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View on GitHub
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {AGENT_CAPABILITIES.map((agent) => (
              <div
                key={agent.name}
                className={`rounded-xl p-4 ${agent.bg} ring-1 ${agent.ring}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm`}
                >
                  <agent.icon className={`h-4 w-4 ${agent.color}`} />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {agent.name}
                </p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {agent.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Company Health
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            {demoMode
              ? "Explore a curated simulation of real-time company health insights, generated by the Cortex AI intelligence layer."
              : "Daily signal checks powered by the Company Health Agent."}
          </p>
        </div>
        <Button
          onClick={handleLoadDemo}
          disabled={isPending}
          className="self-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          {demoMode
            ? isPending
              ? "Simulating Agent Reasoning…"
              : "Run Simulated Briefing"
            : isPending
            ? "Generating Insights…"
            : "Generate AI Briefing"}
        </Button>
      </header>

      {/* ── Demo mode banner ─────────────────────────────────────────────────── */}
      {demoMode && (
        <div className="rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 px-5 py-4 flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100">
            <Zap className="h-3.5 w-3.5 text-violet-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
              Interactive Demo Mode
            </p>
            <p className="mt-0.5 text-sm text-violet-800">
              You are exploring a fully interactive simulation of Cortex AI. All
              insights, metrics, and agent behaviours are representative of the
              live product. Click{" "}
              <strong>&ldquo;Run Simulated Briefing&rdquo;</strong> to watch the
              agent reason in real time.
            </p>
          </div>
        </div>
      )}

      {/* ── Metric cards ─────────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-4">
        {deferredSnapshot.metrics.map((metric, i) => {
          const Icon = METRIC_ICONS[i % METRIC_ICONS.length]
          return (
            <Card
              key={metric.label}
              className="relative overflow-hidden border-slate-200 shadow-sm"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardDescription className="text-xs font-medium">
                    {metric.label}
                  </CardDescription>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                    <Icon className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {metric.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-xs text-slate-500">
                <span>{metric.change}</span>
                <TrendIndicator trend={metric.trend} />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ── Briefing + Alerts ────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                AI Daily Briefing
              </CardTitle>
              <Badge
                variant="secondary"
                className="text-[10px] bg-indigo-50 text-indigo-600 border-indigo-100"
              >
                AI Generated
              </Badge>
            </div>
            <CardDescription>
              {demoMode
                ? "A curated example of the briefing the Company Health Agent produces each morning."
                : "Drafted by the Company Health Agent for founder review."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p className="leading-relaxed">{deferredSnapshot.briefing.summary}</p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Priority Focus
              </p>
              <ul className="mt-2 space-y-2">
                {deferredSnapshot.briefing.priorities.map((item, i) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Active Alerts
            </CardTitle>
            <CardDescription>Items needing attention this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            {deferredSnapshot.alerts.map((alert, i) => (
              <div
                key={alert.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      i === 0
                        ? "bg-rose-500"
                        : i === 1
                        ? "bg-amber-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <p className="font-semibold text-slate-900 text-xs">
                    {alert.title}
                  </p>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed pl-4">
                  {alert.detail}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
