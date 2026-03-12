"use client"

import * as React from "react"
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
  BrainCircuit,
  Zap,
  ArrowUpRight,
} from "lucide-react"

type DashboardClientProps = {
  initialSnapshot: CompanyHealthSnapshot
  demoMode?: boolean
}

const METRIC_ICONS = [DollarSign, RefreshCw, Users, GitCommit]

function TrendIndicator({ trend }: { trend: Metric["trend"] }) {
  if (trend === "up")
    return (
      <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
        <TrendingUp className="h-3 w-3" />
        Up
      </span>
    )
  if (trend === "down")
    return (
      <span className="flex items-center gap-1 text-rose-400 text-xs font-medium">
        <TrendingDown className="h-3 w-3" />
        Down
      </span>
    )
  return (
    <span className="flex items-center gap-1 text-slate-500 text-xs">
      <Minus className="h-3 w-3" />
      Flat
    </span>
  )
}

const AGENTS = [
  {
    icon: ActivitySquare,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 ring-indigo-500/20",
    name: "Company Health Agent",
    desc: "Monitors revenue, pipeline, and engineering velocity. Delivers a daily AI briefing.",
  },
  {
    icon: HeartPulse,
    color: "text-rose-400",
    bg: "bg-rose-500/10 ring-rose-500/20",
    name: "People Coach Agent",
    desc: "Analyses HR signals, flags burnout risk, and suggests coaching actions for leads.",
  },
  {
    icon: MessageSquare,
    color: "text-amber-400",
    bg: "bg-amber-500/10 ring-amber-500/20",
    name: "Nudging Agent",
    desc: "Drafts personalised outreach and internal messages. Nothing sends without approval.",
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
  const deferred = React.useDeferredValue(snapshot)

  const handleLoad = () => {
    startTransition(async () => {
      const result = await loadDemoData()
      setSnapshot(result.snapshot)
      setLastOperation(result.operation)
    })
  }

  return (
    <section className="flex flex-col gap-8">

      {/* Agent capabilities hero — demo mode only */}
      {demoMode && (
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-indigo-400" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-indigo-400">
                  What Cortex AI Does
                </span>
              </div>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Three AI agents. One command center.
              </h2>
              <p className="mt-1 text-sm text-slate-400 max-w-lg">
                Cortex AI runs continuously — monitoring metrics, coaching your
                team, and drafting communications — without you lifting a finger.
              </p>
            </div>
            <a
              href="https://github.com/Vijayarvind10/founder-operating-system"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View on GitHub <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {AGENTS.map((a) => (
              <div key={a.name} className={`rounded-xl p-4 ring-1 ${a.bg}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08]">
                  <a.icon className={`h-4 w-4 ${a.color}`} />
                </div>
                <p className="mt-3 text-sm font-semibold text-white">{a.name}</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600">
            Company Health
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1.5 max-w-xl text-sm text-slate-400">
            {demoMode
              ? "Explore a curated simulation of real-time company health insights, generated by the Cortex AI intelligence layer."
              : "Daily signal checks powered by the Company Health Agent."}
          </p>
        </div>
        <button
          onClick={handleLoad}
          disabled={isPending}
          className="self-start flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:opacity-60 px-4 py-2.5 text-sm font-medium text-white transition-all shadow-lg shadow-indigo-500/20"
        >
          <Sparkles className="h-4 w-4" />
          {demoMode
            ? isPending
              ? "Simulating…"
              : "Run Simulated Briefing"
            : isPending
            ? "Generating…"
            : "Generate AI Briefing"}
        </button>
      </header>

      {/* Demo mode banner */}
      {demoMode && (
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.08] px-5 py-4 flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Interactive Demo Mode
            </p>
            <p className="mt-0.5 text-sm text-slate-300">
              You are exploring a fully interactive simulation of Cortex AI. All
              insights are representative of the live product. Click{" "}
              <strong className="text-white">
                &ldquo;Run Simulated Briefing&rdquo;
              </strong>{" "}
              to watch the agent reason in real time.
            </p>
          </div>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid gap-4 lg:grid-cols-4 sm:grid-cols-2">
        {deferred.metrics.map((metric, i) => {
          const Icon = METRIC_ICONS[i % METRIC_ICONS.length]
          return (
            <div
              key={metric.label}
              className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-5"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  {metric.label}
                </p>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.08]">
                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-white">
                {metric.value}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">{metric.change}</span>
                <TrendIndicator trend={metric.trend} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Briefing + Alerts */}
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">
                AI Daily Briefing
              </h3>
            </div>
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-400 uppercase tracking-wide">
              AI Generated
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            {demoMode
              ? "A curated example of the briefing the Company Health Agent produces each morning."
              : "Drafted by the Company Health Agent for founder review."}
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            {deferred.briefing.summary}
          </p>
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 mb-3">
              Priority Focus
            </p>
            <ul className="space-y-2.5">
              {deferred.briefing.priorities.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[10px] font-bold text-indigo-400">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Active Alerts</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Items needing attention this week.
          </p>
          <div className="space-y-3">
            {deferred.alerts.map((alert, i) => (
              <div
                key={alert.title}
                className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      i === 0
                        ? "bg-rose-500"
                        : i === 1
                        ? "bg-amber-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <p className="text-xs font-semibold text-white">
                    {alert.title}
                  </p>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed pl-3.5">
                  {alert.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
