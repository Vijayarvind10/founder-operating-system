// Server component — reads env vars directly; no "use client" needed.
import { isDemoMode } from "@/lib/demo-mode";

export function DemoModeBadge() {
  if (!isDemoMode()) return null;

  return (
    <div className="flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5">
      {/* Pulsing presence indicator */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
      </span>
      <span className="text-xs font-medium text-violet-700 leading-none">
        Interactive Demo Mode
      </span>
    </div>
  );
}
