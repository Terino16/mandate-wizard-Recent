"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { authClient } from "@/lib/authclient"
import { useState, useTransition } from "react"
import { Loader } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const [GoogleisPending, startGoogleTransition] = useTransition();
  const [EmailisPending, startEmailTransition] = useTransition();
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const GoogleSignUp = async () => {
    if (name.length === 0) {
      toast.error("Please enter your name")
      return
    }
    
    startGoogleTransition(async () => {
      // Store name in localStorage for later use after Google signup
      localStorage.setItem("signup_name", name)
      
      const { data, error } = await authClient.signIn.social({
        provider: "google"
      })

      if (error) {
        console.log(error)
        toast.error("Google sign-up failed")
        localStorage.removeItem("signup_name") // Clean up on error
      }
      if (data) {
        console.log(data)
        toast.success("Signed up successfully!")
        router.push("/")
      }
    })
  }

  const EmailSignUp = async () => {
    if (name.length === 0) {
      toast.error("Please enter your name")
      return
    }
    
    if(email.length === 0) {
  }
    if(!email.includes("@")) {
      toast.error("Please enter a valid email")
      return
    }
    if(password.length === 0) {
      toast.error("Please enter a password")
      return
    }


    startEmailTransition(async () => {
     await authClient.signUp.email({
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
    }, {
        onSuccess: () => {
          toast.success("Signed up successfully!")
          router.push("/")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
});

  })

}


 

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex items-center justify-center rounded-md">
                {/* <Logo width={64} height={64} /> */}
              </div>
              <span className="sr-only">EduStack</span>
            </a>
            <h1 className="text-xl font-bold">Create your account</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Enter your full name"
                required
              />
            </div>
            
         
            
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              onClick={EmailSignUp} 
              disabled={EmailisPending}
            >
              {EmailisPending ? <Loader className="animate-spin" /> : "Sign Up"}
            </Button>
          </div>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>

          <div className="grid">
            <Button 
              variant="outline" 
              type="button" 
              className="w-full" 
              onClick={GoogleSignUp} 
              disabled={GoogleisPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
