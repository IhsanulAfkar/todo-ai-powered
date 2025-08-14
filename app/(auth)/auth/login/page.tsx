import { Metadata } from "next"
import LoginPage from "@/components/pages/auth/LoginPage"
export const metadata: Metadata = {
  title: 'Login | ' + process.env.NEXT_PUBLIC_APP_NAME,
  description: 'Login Page'
}
export default function Page() {
  return <LoginPage />
}
