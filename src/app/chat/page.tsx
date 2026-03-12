import { ChatInterface } from "@/components/chat/chat-interface"

export const metadata = {
  title: "Ask AI — Cortex AI",
}

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600">
          Agent Interface
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Ask AI</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Query your three AI agents directly. Company health, people coaching,
          and outreach drafting.
        </p>
      </header>
      <ChatInterface />
    </div>
  )
}
