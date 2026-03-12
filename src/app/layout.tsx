import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { AgentStatusProvider, SystemStatus } from "@/components/agent-status";
import { DemoModeBadge } from "@/components/demo-mode-badge";
import {
  Cpu,
  LayoutDashboard,
  Plug,
  Users,
  Bell,
  MessageCircle,
} from "lucide-react";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090f] text-white`}
      >
        <AgentStatusProvider>
          <div className="flex min-h-screen">
            <aside className="flex w-60 shrink-0 flex-col border-r border-white/[0.06] bg-[#0d0d1a] px-4 py-7">
              {/* Logo */}
              <div className="flex items-center gap-2.5 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 ring-1 ring-indigo-500/30">
                  <Cpu className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white leading-none">
                    Cortex AI
                  </div>
                  <div className="text-[10px] text-indigo-400/60 leading-none mt-0.5">
                    AI Command Center
                  </div>
                </div>
              </div>

              {/* Active agents pill */}
              <div className="mt-5 mx-2 flex items-center gap-2 rounded-lg bg-white/[0.05] px-3 py-2 ring-1 ring-white/[0.08]">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs text-slate-400">3 agents active</span>
              </div>

              {/* Nav */}
              <nav className="mt-6 flex flex-col gap-0.5">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 hover:bg-white/[0.06] hover:text-white transition-colors duration-150"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-6 flex flex-col gap-3 px-2">
                <DemoModeBadge />
                <p className="text-[10px] text-slate-700 leading-relaxed">
                  Health · Coach · Nudging
                </p>
              </div>
            </aside>

            <div className="flex flex-1 flex-col min-w-0">
              <main className="flex-1 px-10 py-10">{children}</main>
              <footer className="border-t border-white/[0.06] px-10 py-3">
                <SystemStatus />
              </footer>
            </div>
          </div>
        </AgentStatusProvider>
      </body>
    </html>
  );
}
