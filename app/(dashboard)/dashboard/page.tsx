
import DashboardPage from "@/components/pages/dashboard/DashboardPage"
import { APP_NAME } from "@/lib/clientConst"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Dashboard | ' + APP_NAME
}
export default function Page() {
  return <DashboardPage />
}
