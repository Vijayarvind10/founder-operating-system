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
      className="flex items-center gap-3 rounded border px-4 py-3 text-sm"
      style={{
        backgroundColor: "#0f0f12",
        borderColor: message.type === "success" ? "#065f46" : "#7f1d1d",
        color: "#f0ede8",
      }}
    >
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{
          backgroundColor:
            message.type === "success" ? "#34d399" : "#f87171",
          color: "#07070a",
        }}
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

function StatusBadge({ status }: { status: DemoNudge["status"] }) {
  const map: Record<
    DemoNudge["status"],
    { label: string; borderColor: string; bgColor: string; textColor: string }
  > = {
    PENDING: {
      label: "PENDING",
      borderColor: "#92400e",
      bgColor: "rgba(245,158,11,0.06)",
      textColor: "#f59e0b",
    },
    APPROVED: {
      label: "APPROVED",
      borderColor: "#065f46",
      bgColor: "rgba(52,211,153,0.06)",
      textColor: "#34d399",
    },
    REJECTED: {
      label: "REJECTED",
      borderColor: "#7f1d1d",
      bgColor: "rgba(248,113,113,0.06)",
      textColor: "#f87171",
    },
  }
  const cfg = map[status]
  return (
    <span
      className="rounded border px-2.5 py-0.5 text-[9px] font-medium"
      style={{
        borderColor: cfg.borderColor,
        backgroundColor: cfg.bgColor,
        color: cfg.textColor,
        fontFamily: "var(--font-jetbrains-mono)",
      }}
    >
      {cfg.label}
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
      className="rounded border transition-opacity"
      style={{
        backgroundColor: "#0f0f12",
        borderColor: "#1c1c20",
        opacity: isTerminal ? 0.7 : 1,
      }}
    >
      {/* Header */}
      <div
        className="border-b px-5 py-4"
        style={{ borderColor: "#1c1c20" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p
              className="text-sm font-bold"
              style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
            >
              {nudge.subject}
            </p>
            <p
              className="text-xs"
              style={{ color: "#6b6b70" }}
            >
              To:{" "}
              <span style={{ color: "#f0ede8" }}>
                {nudge.recipientName}
              </span>{" "}
              · {nudge.recipientEmail}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {nudge.agentGenerated && (
              <span
                className="rounded border px-2 py-0.5 text-[9px] font-medium"
                style={{
                  color: "#f59e0b",
                  borderColor: "#92400e",
                  backgroundColor: "rgba(245,158,11,0.06)",
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
              >
                AI GENERATED
              </span>
            )}
            <span
              className="rounded border px-2.5 py-0.5 text-[9px] font-medium"
              style={{
                color: "#6b6b70",
                borderColor: "#1c1c20",
                backgroundColor: "#07070a",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              {channelLabel(nudge.channel).toUpperCase()}
            </span>
            <StatusBadge status={nudge.status} />
          </div>
        </div>

        <p
          className="mt-2 text-[10px]"
          style={{
            color: "#3a3a3f",
            fontFamily: "var(--font-jetbrains-mono)",
          }}
        >
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
            className="w-full resize-none rounded border px-3 py-2.5 text-sm outline-none transition-all"
            style={{
              backgroundColor: "#07070a",
              borderColor: "#1c1c20",
              color: "#f0ede8",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "#f59e0b")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "#1c1c20")
            }
          />
        ) : (
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: "#6b6b70" }}
          >
            {nudge.body}
          </p>
        )}
      </div>

      {/* Footer actions */}
      <div
        className="border-t px-5 py-3 flex items-center justify-end gap-2"
        style={{ borderColor: "#1c1c20" }}
      >
        {editing ? (
          <>
            <button
              onClick={() => {
                setDraftBody(nudge.body)
                setEditing(false)
              }}
              className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs transition-colors"
              style={{ color: "#6b6b70" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#f0ede8"
                e.currentTarget.style.backgroundColor = "#1c1c20"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#6b6b70"
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(nudge.id, draftBody)
                setEditing(false)
              }}
              className="flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                borderColor: "#1c1c20",
                backgroundColor: "#1c1c20",
                color: "#f0ede8",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2a2a30"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1c1c20"
              }}
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
              className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: "#6b6b70" }}
              onMouseEnter={(e) => {
                if (!isTerminal) {
                  e.currentTarget.style.color = "#f0ede8"
                  e.currentTarget.style.backgroundColor = "#1c1c20"
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#6b6b70"
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={() => onReject(nudge.id, nudge.recipientName)}
              disabled={nudge.status !== "PENDING"}
              className="flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: "#1c1c20", color: "#6b6b70" }}
              onMouseEnter={(e) => {
                if (nudge.status === "PENDING") {
                  e.currentTarget.style.borderColor = "#7f1d1d"
                  e.currentTarget.style.color = "#f87171"
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1c1c20"
                e.currentTarget.style.color = "#6b6b70"
              }}
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </button>
            <button
              onClick={() => onApprove(nudge.id, nudge.recipientName)}
              disabled={nudge.status !== "PENDING"}
              className="flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              style={
                nudge.status === "PENDING"
                  ? {
                      backgroundColor: "#f59e0b",
                      borderColor: "#f59e0b",
                      color: "#07070a",
                    }
                  : {
                      backgroundColor: "#1c1c20",
                      borderColor: "#1c1c20",
                      color: "#3a3a3f",
                    }
              }
              onMouseEnter={(e) => {
                if (nudge.status === "PENDING") {
                  e.currentTarget.style.backgroundColor = "#d97706"
                  e.currentTarget.style.borderColor = "#d97706"
                }
              }}
              onMouseLeave={(e) => {
                if (nudge.status === "PENDING") {
                  e.currentTarget.style.backgroundColor = "#f59e0b"
                  e.currentTarget.style.borderColor = "#f59e0b"
                }
              }}
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
          <h2
            className="text-[9px]"
            style={{
              color: "#3a3a3f",
              fontFamily: "var(--font-jetbrains-mono)",
              letterSpacing: "0.15em",
            }}
          >
            // PENDING APPROVAL — {pending.length}
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
          <h2
            className="text-[9px]"
            style={{
              color: "#3a3a3f",
              fontFamily: "var(--font-jetbrains-mono)",
              letterSpacing: "0.15em",
            }}
          >
            // ACTIONED — {actioned.length}
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
        <div
          className="rounded border-dashed border py-16 text-center text-sm"
          style={{ borderColor: "#1c1c20", color: "#3a3a3f" }}
        >
          No nudge drafts available. The Nudging Agent will populate this list
          automatically.
        </div>
      )}

      <ToastRegion messages={toasts} dismiss={dismissToast} />
    </>
  )
}
