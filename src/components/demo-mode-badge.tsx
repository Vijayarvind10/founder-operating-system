// Server component — reads env vars directly; no "use client" needed.
import { isDemoMode } from "@/lib/demo-mode";

export function DemoModeBadge() {
  if (!isDemoMode()) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-3 py-2">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
      </span>
      <span className="text-xs font-medium text-indigo-300 leading-none">
        Demo Mode
      </span>
    </div>
  );
}
