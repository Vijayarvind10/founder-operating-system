import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { AgentStatusProvider, SystemStatus } from "@/components/agent-status";
import { DemoModeBadge } from "@/components/demo-mode-badge";
import {
  BrainCircuit,
  LayoutDashboard,
  Plug,
  Users,
  Bell,
} from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cortex AI — AI Command Center for Founders",
  description:
    "Three AI agents monitoring your company health, coaching your team, and drafting communications — 24/7.",
};

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/connections", label: "Connections", icon: Plug },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/nudges", label: "Nudges", icon: Bell },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AgentStatusProvider>
          <div className="flex min-h-screen bg-slate-50 text-slate-900">
            {/* Sidebar */}
            <aside className="flex w-64 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 px-5 py-8 text-white shrink-0">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30">
                  <BrainCircuit className="h-5 w-5 text-indigo-300" />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight text-white">
                    Cortex AI
                  </div>
                  <div className="text-[10px] leading-none mt-0.5 text-indigo-300/70">
                    AI Command Center
                  </div>
                </div>
              </div>

              {/* Agent status pill */}
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs text-slate-300">3 agents active</span>
              </div>

              {/* Nav */}
              <nav className="mt-8 flex flex-col gap-1 text-sm font-medium">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors duration-150"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Footer */}
              <div className="mt-auto pt-8 flex flex-col gap-3">
                <DemoModeBadge />
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  Company Health · People Coach · Nudging
                </p>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col min-w-0">
              <main className="flex-1 px-10 py-10">{children}</main>
              <footer className="border-t border-slate-200 bg-white px-10 py-4">
                <SystemStatus />
              </footer>
            </div>
          </div>
        </AgentStatusProvider>
      </body>
    </html>
  );
}
