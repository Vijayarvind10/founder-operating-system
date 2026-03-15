import { ChatInterface } from "@/components/chat/chat-interface"

export const metadata = {
  title: "Ask AI — Cortex AI",
}

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <p
          className="text-[10px] mb-1.5"
          style={{
            color: "#3a3a3f",
            fontFamily: "var(--font-jetbrains-mono)",
            letterSpacing: "0.15em",
          }}
        >
          // AGENT INTERFACE
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-syne)", color: "#f0ede8" }}
        >
          Ask AI
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "#6b6b70" }}>
          Query your three AI agents directly. Company health, people coaching,
          and outreach drafting.
        </p>
      </header>
      <ChatInterface />
    </div>
  )
}
