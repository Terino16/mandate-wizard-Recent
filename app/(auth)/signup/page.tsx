import { SignupForm } from "@/app/(auth)/signup/_component/signup-form"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Signup() {
  const session = await auth.api.getSession({
    headers: await headers() 
})

if(session)
  redirect('/')


  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
