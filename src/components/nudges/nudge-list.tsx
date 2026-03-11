"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  approveNudge,
  rejectNudge,
  updateNudgeBody,
} from "@/lib/db/nudge-actions";
import type { NudgeRow } from "@/lib/db/nudge-actions";
import type { NudgeChannel, NudgeStatus } from "@/generated/prisma/client";

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error";
}

function Toast({ message, onDone }: { message: ToastMessage; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg",
        message.type === "success" ? "bg-slate-900" : "bg-rose-600"
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
          message.type === "success"
            ? "bg-emerald-400 text-slate-900"
            : "bg-white text-rose-600"
        )}
      >
        {message.type === "success" ? "✓" : "✕"}
      </span>
      {message.text}
    </div>
  );
}

function ToastRegion({
  messages,
  dismiss,
}: {
  messages: ToastMessage[];
  dismiss: (id: number) => void;
}) {
  if (messages.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {messages.map((m) => (
        <Toast key={m.id} message={m} onDone={() => dismiss(m.id)} />
      ))}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function channelLabel(channel: NudgeChannel) {
  const labels: Record<NudgeChannel, string> = {
    EMAIL: "Email",
    SLACK: "Slack",
    TEAMS: "Teams",
  };
  return labels[channel];
}

function channelBadgeClass(channel: NudgeChannel) {
  const classes: Record<NudgeChannel, string> = {
    EMAIL: "border-slate-300 text-slate-600",
    SLACK: "border-indigo-300 text-indigo-700 bg-indigo-50",
    TEAMS: "border-violet-300 text-violet-700 bg-violet-50",
  };
  return classes[channel];
}

function StatusBadge({ status }: { status: NudgeStatus }) {
  const map: Record<NudgeStatus, { label: string; className: string }> = {
    PENDING: {
      label: "Pending Approval",
      className: "border-amber-300 bg-amber-50 text-amber-700",
    },
    APPROVED: {
      label: "Approved",
      className: "border-emerald-200 bg-emerald-50 text-emerald-600",
    },
    REJECTED: {
      label: "Rejected",
      className: "border-rose-200 bg-rose-50 text-rose-600",
    },
    SENT: {
      label: "Sent",
      className: "border-emerald-200 bg-emerald-100 text-emerald-700",
    },
    FAILED: {
      label: "Failed",
      className: "border-rose-300 bg-rose-100 text-rose-700",
    },
  };
  const { label, className } = map[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

function formatScheduled(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Individual Nudge Card ────────────────────────────────────────────────────

interface NudgeCardProps {
  nudge: NudgeRow;
  onApprove: (id: string, recipientName: string) => void;
  onReject: (id: string, recipientName: string) => void;
  onSave: (id: string, newBody: string) => void;
}

function NudgeCard({ nudge, onApprove, onReject, onSave }: NudgeCardProps) {
  const [editing, setEditing] = useState(false);
  const [draftBody, setDraftBody] = useState(nudge.body);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  // Sync body when parent updates after server action
  useEffect(() => {
    if (!editing) setDraftBody(nudge.body);
  }, [nudge.body, editing]);

  const isTerminal =
    nudge.status === "APPROVED" ||
    nudge.status === "REJECTED" ||
    nudge.status === "SENT";

  return (
    <Card className={cn("transition-opacity", isTerminal && "opacity-70")}>
      {/* Header */}
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-slate-900">{nudge.subject}</CardTitle>
            <CardDescription>
              To:{" "}
              <span className="font-medium text-slate-700">
                {nudge.recipientName}
              </span>{" "}
              · {nudge.recipientEmail}
            </CardDescription>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("capitalize", channelBadgeClass(nudge.channel))}
            >
              {channelLabel(nudge.channel)}
            </Badge>
            <StatusBadge status={nudge.status} />
          </div>
        </div>

        <p className="mt-1 text-xs text-slate-400">
          Scheduled for {formatScheduled(nudge.scheduledFor)}
        </p>
      </CardHeader>

      {/* Body */}
      <CardContent className="pt-4">
        {editing ? (
          <textarea
            ref={textareaRef}
            value={draftBody}
            onChange={(e) => setDraftBody(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        ) : (
          <p className="text-sm leading-relaxed text-slate-600">{nudge.body}</p>
        )}
      </CardContent>

      {/* Footer actions */}
      <CardFooter className="justify-end gap-2">
        {editing ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDraftBody(nudge.body);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onSave(nudge.id, draftBody);
                setEditing(false);
              }}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              disabled={isTerminal}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(nudge.id, nudge.recipientName)}
              disabled={nudge.status !== "PENDING"}
              className={cn(
                nudge.status !== "PENDING" && "cursor-default opacity-40"
              )}
            >
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(nudge.id, nudge.recipientName)}
              disabled={nudge.status !== "PENDING"}
              className={cn(
                nudge.status === "PENDING"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "cursor-default bg-emerald-100 text-emerald-700 border-emerald-200"
              )}
            >
              {nudge.status === "APPROVED" ? "Approved" : "Approve"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

// ─── Main List ────────────────────────────────────────────────────────────────

export function NudgeList({ initialNudges }: { initialNudges: NudgeRow[] }) {
  const [nudges, setNudges] = useState<NudgeRow[]>(initialNudges);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextToastId = useRef(0);
  const [, startTransition] = useTransition();

  // Keep local state in sync when the server re-renders with fresh data
  useEffect(() => {
    setNudges(initialNudges);
  }, [initialNudges]);

  function pushToast(text: string, type: ToastMessage["type"] = "success") {
    const id = nextToastId.current++;
    setToasts((prev) => [...prev, { id, text, type }]);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function optimisticStatus(id: string, status: NudgeRow["status"]) {
    setNudges((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status } : n))
    );
  }

  function handleApprove(id: string, recipientName: string) {
    optimisticStatus(id, "APPROVED");
    startTransition(async () => {
      try {
        await approveNudge(id);
        pushToast(`Nudge to ${recipientName} approved and queued for delivery.`);
      } catch {
        optimisticStatus(id, "PENDING");
        pushToast("Failed to approve nudge. Please try again.", "error");
      }
    });
  }

  function handleReject(id: string, recipientName: string) {
    optimisticStatus(id, "REJECTED");
    startTransition(async () => {
      try {
        await rejectNudge(id);
        pushToast(`Nudge to ${recipientName} rejected.`);
      } catch {
        optimisticStatus(id, "PENDING");
        pushToast("Failed to reject nudge. Please try again.", "error");
      }
    });
  }

  function handleSave(id: string, newBody: string) {
    setNudges((prev) =>
      prev.map((n) => (n.id === id ? { ...n, body: newBody } : n))
    );
    startTransition(async () => {
      try {
        await updateNudgeBody(id, newBody);
        pushToast("Nudge updated successfully.");
      } catch {
        pushToast("Failed to save changes. Please try again.", "error");
      }
    });
  }

  const pending = nudges.filter((n) => n.status === "PENDING");
  const actioned = nudges.filter((n) => n.status !== "PENDING");

  return (
    <>
      {pending.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
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
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
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
        <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-400">
          No nudge drafts available. The Nudging Agent will populate this list automatically.
        </div>
      )}

      <ToastRegion messages={toasts} dismiss={dismissToast} />
    </>
  );
}
