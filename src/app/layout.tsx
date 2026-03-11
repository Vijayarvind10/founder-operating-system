import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { AgentStatusProvider, SystemStatus } from "@/components/agent-status";
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
  title: "Founder Operating System",
  description: "AI operating system for founders",
};

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
            <aside className="w-64 border-r border-slate-200 bg-white px-6 py-8">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Founder OS
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                Control Center
              </div>
              <nav className="mt-10 flex flex-col gap-2 text-sm font-medium">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/connections"
                  className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  Connections
                </Link>
                <Link
                  href="/teams"
                  className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  Teams
                </Link>
                <Link
                  href="/nudges"
                  className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  Nudges
                </Link>
              </nav>
            </aside>
            <div className="flex flex-1 flex-col">
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
