import type { Metadata } from "next";
import Link from "next/link";
import { Syne, JetBrains_Mono, Geist } from "next/font/google";
import { AgentStatusProvider, SystemStatus } from "@/components/agent-status";
import { DemoModeBadge } from "@/components/demo-mode-badge";
import {
  Terminal,
  LayoutDashboard,
  Plug,
  Users,
  Bell,
  MessageCircle,
} from "lucide-react";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Cortex AI — AI Command Center for Founders",
  description:
    "Three AI agents monitoring your company health, coaching your team, and drafting communications — 24/7.",
};

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Ask AI", icon: MessageCircle },
  { href: "/connections", label: "Connections", icon: Plug },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/nudges", label: "Nudges", icon: Bell },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${jetbrainsMono.variable} ${geist.variable} font-[family-name:var(--font-geist)]`}
        style={{ backgroundColor: "#07070a", color: "#f0ede8" }}
      >
        <AgentStatusProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside
              className="flex w-56 shrink-0 flex-col border-r px-4 py-6"
              style={{ backgroundColor: "#0f0f12", borderColor: "#1c1c20" }}
            >
              {/* Logo */}
              <div className="flex items-center gap-2.5 px-2 mb-6">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded"
                  style={{ backgroundColor: "#f59e0b" }}
                >
                  <Terminal
                    className="h-3.5 w-3.5"
                    style={{ color: "#07070a" }}
                  />
                </div>
                <div>
                  <div
                    className="text-sm font-bold leading-none"
                    style={{
                      fontFamily: "var(--font-syne)",
                      color: "#f0ede8",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Cortex AI
                  </div>
                  <div
                    className="text-[9px] leading-none mt-0.5"
                    style={{
                      color: "#6b6b70",
                      fontFamily: "var(--font-jetbrains-mono)",
                    }}
                  >
                    v0.1 · DEMO
                  </div>
                </div>
              </div>

              {/* Status */}
              <div
                className="mx-2 mb-6 flex items-center gap-2 rounded px-2.5 py-1.5 border"
                style={{ borderColor: "#1c1c20", backgroundColor: "#07070a" }}
              >
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: "#34d399" }}
                  />
                  <span
                    className="relative inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "#34d399" }}
                  />
                </span>
                <span
                  className="text-[10px]"
                  style={{
                    color: "#6b6b70",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  3 agents online
                </span>
              </div>

              {/* Nav */}
              <nav className="flex flex-col gap-0.5">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="nav-link group flex items-center gap-2.5 rounded px-2.5 py-2 text-sm"
                    style={{
                      fontFamily: "var(--font-syne)",
                      fontWeight: 600,
                    }}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-6 flex flex-col gap-3 px-2">
                <DemoModeBadge />
                <p
                  className="text-[9px] leading-relaxed"
                  style={{
                    color: "#3a3a3f",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  HEALTH / COACH / NUDGE
                </p>
              </div>
            </aside>

            {/* Main */}
            <div
              className="flex flex-1 flex-col min-w-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #1c1c20 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            >
              <main className="flex-1 px-10 py-10">{children}</main>
              <footer
                className="px-10 py-3 border-t"
                style={{ borderColor: "#1c1c20", backgroundColor: "#07070a" }}
              >
                <SystemStatus />
              </footer>
            </div>
          </div>
        </AgentStatusProvider>
      </body>
    </html>
  );
}
