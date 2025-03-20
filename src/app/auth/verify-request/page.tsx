"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { signIn } from "next-auth/react"

export default function VerifyRequestPage() {
  const [email, setEmail] = useState<string>("")
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    // Get email from URL query params or session storage
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get("email")

    if (emailParam) {
      setEmail(emailParam)
      sessionStorage.setItem("signInEmail", emailParam)
    } else {
      const storedEmail = sessionStorage.getItem("signInEmail")
      if (storedEmail) setEmail(storedEmail)
    }

    // Timer for "resend email" option
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const canResend = timeElapsed >= 60

  const handleResendEmail = () => {
    // Reset timer
    setTimeElapsed(0)
    
    // Only proceed if we have an email
    if (email) {
      // Call the sign in method again to trigger a new email
      signIn("email", { 
        email, 
        redirect: false
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 p-4">
      {/* Pixel art email animation */}
      <div className="mb-8 relative w-[120px] h-[120px] flex items-center justify-center">
        <div className="relative">
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-[60px] h-[50px] bg-white border-[3px] border-[#4c1d95] shadow-[0_2px_0_rgba(0,0,0,0.2)] z-[2] animate-[float_3s_ease-in-out_infinite]">
            {/* Letter content */}
            <div className="absolute top-[10px] left-[10%] w-[80%] h-[30px]">
              <div className="w-full h-[4px] bg-[#c4b5fd] mb-[6px]"></div>
              <div className="w-full h-[4px] bg-[#c4b5fd] mb-[6px]"></div>
              <div className="w-full h-[4px] bg-[#c4b5fd]"></div>
            </div>
          </div>
          <div className="w-[80px] h-[60px] bg-[#8b5cf6] relative m-0 border-[4px] border-[#4c1d95] shadow-[0_4px_0_rgba(0,0,0,0.3)] z-[1]">
            <div className="absolute top-0 left-0 w-full h-full bg-[#9333ea] clip-path-[polygon(0_0,50%_40%,100%_0,100%_40%,50%_80%,0_40%)] z-[3]"></div>
            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-[#7c3aed] z-[1]"></div>
          </div>
          <div className="absolute -top-4 -right-4 w-[20px] h-[20px] bg-[radial-gradient(circle,#f9a8d4_20%,transparent_30%)] animate-pulse">
            <div className="absolute top-[-10px] left-[5px] w-[8px] h-[8px] bg-[#f9a8d4] rounded-full"></div>
            <div className="absolute bottom-[-5px] right-[-5px] w-[8px] h-[8px] bg-[#f9a8d4] rounded-full"></div>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md p-6 border-2 border-purple-500 bg-black/40 backdrop-blur-sm text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold tracking-tight font-[var(--font-press-start-2p)] text-shadow-[2px_2px_0_rgba(0,0,0,0.5)] -tracking-[0.5px]">Check Your Email</h1>

          <div className="h-[4px] w-[80%] mx-auto bg-[repeating-linear-gradient(to_right,transparent,transparent_4px,#a855f7_4px,#a855f7_8px)]"></div>

          <div className="space-y-2">
            <p className="text-sm text-purple-200">We&apos;ve sent a magic link to:</p>
            <p className="font-mono text-md bg-purple-900/50 py-1 px-2 rounded inline-block">
              {email || "your email address"}
            </p>
          </div>

          <p className="text-sm text-purple-200">
            Click the link in the email to sign in to your account.
            <br />
            The link will expire in 10 minutes.
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <Button
              variant="outline"
              className="bg-transparent border-purple-500 hover:bg-purple-900/50 text-white w-full relative border-[2px] after:content-[''] after:absolute after:bottom-[-2px] after:right-[-2px] after:w-[6px] after:h-[6px] after:bg-[#a855f7] after:clip-path-[polygon(100%_0,0%_100%,100%_100%)]"
              onClick={handleResendEmail}
              disabled={!canResend}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {canResend ? "Resend Email" : `Resend in ${60 - timeElapsed}s`}
            </Button>

            <Link href="/login" className="w-full">
              <Button variant="ghost" className="text-purple-200 hover:text-white hover:bg-transparent w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
} 