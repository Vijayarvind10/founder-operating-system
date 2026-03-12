// Server component — reads env vars directly; no "use client" needed.
import { isDemoMode } from "@/lib/demo-mode";

export function DemoModeBadge() {
  if (!isDemoMode()) return null;

  return (
    <div
      className="flex items-center gap-2 rounded border px-2.5 py-1.5"
      style={{ borderColor: "#92400e", backgroundColor: "rgba(245,158,11,0.06)" }}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ backgroundColor: "#f59e0b" }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "#f59e0b" }}
        />
      </span>
      <span
        className="text-[9px] font-medium leading-none"
        style={{ color: "#f59e0b", fontFamily: "var(--font-jetbrains-mono)" }}
      >
        DEMO MODE
      </span>
    </div>
  );
}
