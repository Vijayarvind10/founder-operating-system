import { getCompanyHealthSnapshot } from "@/lib/company-health"
import { isDemoMode } from "@/lib/demo-mode"
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const snapshot = getCompanyHealthSnapshot()

  return <DashboardClient initialSnapshot={snapshot} demoMode={isDemoMode()} />
}
