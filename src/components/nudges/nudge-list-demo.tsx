"use client"

import { useState, useEffect, useRef } from "react"
import { CheckCircle2, XCircle, Edit3, X, Check } from "lucide-react"

type DemoNudge = {
  id: string
  recipientName: string
  recipientEmail: string
  channel: "EMAIL" | "SLACK"
  subject: string
  body: string
  scheduledFor: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  agentGenerated: boolean
}

const INITIAL_NUDGES: DemoNudge[] = [
  {
    id: "1",
    recipientName: "Jordan Lee",
    recipientEmail: "jordan.lee@acmecorp.com",
    channel: "EMAIL",
    subject: "Checking in — how's everything going?",
    body: "Hi Jordan,\n\nI wanted to reach out personally — I noticed your team's usage has been lighter than usual over the past couple of weeks, and I want to make sure we're delivering the value you expected.\n\nWould you have 20 minutes this week or next for a quick call? I'd love to hear what's working and where we can do better for you.\n\nLooking forward to connecting.",
    scheduledFor: new Date(Date.now() + 86400000).toISOString(),
    status: "PENDING",
    agentGenerated: true,
  },
  {
    id: "2",
    recipientName: "Sarah Chen",
    recipientEmail: "sarah.chen@company.com",
    channel: "SLACK",
    subject: "Quick check-in",
    body: "Hey Sarah — I noticed you've had a heavy few weeks. I just want to make sure you're doing okay and that the team isn't piling too much on you. No pressure to reply fast, but let me know if you'd like to talk through anything on Thursday.",
    scheduledFor: new Date(Date.now() + 172800000).toISOString(),
    status: "PENDING",
    agentGenerated: true,
  },
  {
    id: "3",
    recipientName: "Alex Northwind",
    recipientEmail: "alex@northwind.io",
    channel: "EMAIL",
    subject: "Your renewal is coming up — let's make it count",
    body: "Hi Alex,\n\nYour subscription renews in 30 days. We've been working on some improvements based on feedback from accounts like yours, and I'd love to walk you through what's new.\n\nWould a 30-minute call next week work for you?",
    scheduledFor: new Date(Date.now() + 259200000).toISOString(),
    status: "APPROVED",
    agentGenerated: true,
  },
]

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastMessage {
  id: number
  text: string
  type: "success" | "error"
}

function Toast({
  message,
  onDone,
}: {
  message: ToastMessage
  onDone: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
        message.type === "success"
          ? "bg-[#0d0d1a] border border-white/[0.08]"
          : "bg-rose-900/80 border border-rose-500/30"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          message.type === "success"
            ? "bg-emerald-400 text-slate-900"
            : "bg-rose-400 text-white"
        }`}
      >
        {message.type === "success" ? "✓" : "✕"}
      </span>
      {message.text}
    </div>
  )
}

function ToastRegion({
  messages,
  dismiss,
}: {
  messages: ToastMessage[]
  dismiss: (id: number) => void
}) {
  if (messages.length === 0) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {messages.map((m) => (
        <Toast key={m.id} message={m} onDone={() => dismiss(m.id)} />
      ))}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function channelLabel(channel: "EMAIL" | "SLACK") {
  return channel === "EMAIL" ? "Email" : "Slack"
}

function channelBadgeClass(channel: "EMAIL" | "SLACK") {
  if (channel === "SLACK")
    return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
  return "bg-white/[0.05] border-white/[0.08] text-slate-400"
}

function StatusBadge({ status }: { status: DemoNudge["status"] }) {
  const map: Record<
    DemoNudge["status"],
    { label: string; className: string }
  > = {
    PENDING: {
      label: "Pending Approval",
      className: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    },
    APPROVED: {
      label: "Approved",
      className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    },
  }
  const { label, className } = map[status]
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${className}`}
    >
      {label}
    </span>
  )
}

function formatScheduled(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ─── Individual Nudge Card ────────────────────────────────────────────────────

interface NudgeCardProps {
  nudge: DemoNudge
  onApprove: (id: string, recipientName: string) => void
  onReject: (id: string, recipientName: string) => void
  onSave: (id: string, newBody: string) => void
}

function NudgeCard({ nudge, onApprove, onReject, onSave }: NudgeCardProps) {
  const [editing, setEditing] = useState(false)
  const [draftBody, setDraftBody] = useState(nudge.body)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) textareaRef.current?.focus()
  }, [editing])

  useEffect(() => {
    if (!editing) setDraftBody(nudge.body)
  }, [nudge.body, editing])

  const isTerminal =
    nudge.status === "APPROVED" || nudge.status === "REJECTED"

  return (
    <div
      className={`rounded-2xl bg-white/[0.04] border border-white/[0.07] transition-opacity ${
        isTerminal ? "opacity-70" : ""
      }`}
    >
      {/* Header */}
      <div className="border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-white">{nudge.subject}</p>
            <p className="text-xs text-slate-500">
              To:{" "}
              <span className="font-medium text-slate-400">
                {nudge.recipientName}
              </span>{" "}
              · {nudge.recipientEmail}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {nudge.agentGenerated && (
              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
                AI Generated
              </span>
            )}
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${channelBadgeClass(nudge.channel)}`}
            >
              {channelLabel(nudge.channel)}
            </span>
            <StatusBadge status={nudge.status} />
          </div>
        </div>

        <p className="mt-2 text-xs text-slate-600">
          Scheduled for {formatScheduled(nudge.scheduledFor)} · Nudging Agent
        </p>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {editing ? (
          <textarea
            ref={textareaRef}
            value={draftBody}
            onChange={(e) => setDraftBody(e.target.value)}
            rows={6}
            className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500/40 focus:bg-white/[0.06] transition-all"
          />
        ) : (
          <p className="text-sm leading-relaxed text-slate-400 whitespace-pre-wrap">
            {nudge.body}
          </p>
        )}
      </div>

      {/* Footer actions */}
      <div className="border-t border-white/[0.06] px-5 py-3 flex items-center justify-end gap-2">
        {editing ? (
          <>
            <button
              onClick={() => {
                setDraftBody(nudge.body)
                setEditing(false)
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(nudge.id, draftBody)
                setEditing(false)
              }}
              className="flex items-center gap-1.5 rounded-lg bg-white/[0.08] px-3 py-1.5 text-xs text-white hover:bg-white/[0.12] transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              Save
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              disabled={isTerminal}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:text-white hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={() => onReject(nudge.id, nudge.recipientName)}
              disabled={nudge.status !== "PENDING"}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-slate-400 hover:border-rose-500/30 hover:text-rose-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </button>
            <button
              onClick={() => onApprove(nudge.id, nudge.recipientName)}
              disabled={nudge.status !== "PENDING"}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                nudge.status === "PENDING"
                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                  : "bg-white/[0.05] border border-white/[0.06] text-slate-600 cursor-default"
              } disabled:cursor-not-allowed`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {nudge.status === "APPROVED" ? "Approved" : "Approve"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main List ────────────────────────────────────────────────────────────────

export function NudgeDemoList() {
  const [nudges, setNudges] = useState<DemoNudge[]>(INITIAL_NUDGES)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextToastId = useRef(0)

  function pushToast(
    text: string,
    type: ToastMessage["type"] = "success"
  ) {
    const id = nextToastId.current++
    setToasts((prev) => [...prev, { id, text, type }])
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function handleApprove(id: string, recipientName: string) {
    setNudges((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "APPROVED" as const } : n))
    )
    pushToast(`Nudge to ${recipientName} approved and queued for delivery.`)
  }

  function handleReject(id: string, recipientName: string) {
    setNudges((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "REJECTED" as const } : n))
    )
    pushToast(`Nudge to ${recipientName} rejected.`)
  }

  function handleSave(id: string, newBody: string) {
    setNudges((prev) =>
      prev.map((n) => (n.id === id ? { ...n, body: newBody } : n))
    )
    pushToast("Nudge updated successfully.")
  }

  const pending = nudges.filter((n) => n.status === "PENDING")
  const actioned = nudges.filter((n) => n.status !== "PENDING")

  return (
    <>
      {pending.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Pending Approval — {pending.length}
          </h2>
          {pending.map((nudge) => (
            <NudgeCard
              key={nudge.id}
              nudge={nudge}
              onApprove={handleApprove}
              onReject={handleReject}
              onSave={handleSave}
            />
          ))}
        </section>
      )}

      {actioned.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Actioned — {actioned.length}
          </h2>
          {actioned.map((nudge) => (
            <NudgeCard
              key={nudge.id}
              nudge={nudge}
              onApprove={handleApprove}
              onReject={handleReject}
              onSave={handleSave}
            />
          ))}
        </section>
      )}

      {nudges.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/[0.06] py-16 text-center text-sm text-slate-600">
          No nudge drafts available. The Nudging Agent will populate this list
          automatically.
        </div>
      )}

      <ToastRegion messages={toasts} dismiss={dismissToast} />
    </>
  )
}
