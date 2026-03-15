"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageCircle,
  Plug,
  Users,
  Bell,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Ask AI", icon: MessageCircle },
  { href: "/connections", label: "Connections", icon: Plug },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/nudges", label: "Nudges", icon: Bell },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-2.5 rounded py-2 text-sm transition-colors"
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 600,
              paddingLeft: isActive ? "8px" : "10px",
              paddingRight: "10px",
              borderLeft: isActive
                ? "2px solid #f59e0b"
                : "2px solid transparent",
              color: isActive ? "#f0ede8" : "#6b6b70",
              backgroundColor: isActive ? "#1c1c20" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = "#f0ede8"
                e.currentTarget.style.backgroundColor = "#1c1c20"
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = "#6b6b70"
                e.currentTarget.style.backgroundColor = "transparent"
              }
            }}
          >
            <Icon
              className="h-3.5 w-3.5 shrink-0 transition-colors"
              style={{ color: isActive ? "#f59e0b" : "currentColor" }}
            />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
