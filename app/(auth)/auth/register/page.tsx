import RegisterPage from "@/components/pages/auth/RegisterPage"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: 'Register | ' + process.env.NEXT_PUBLIC_APP_NAME
}
export default function Page() {
  return <RegisterPage />
}
