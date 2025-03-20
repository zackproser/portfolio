"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AuthErrorPage() {
  const [errorType, setErrorType] = useState<string | null>(null)
  const [errorDescription, setErrorDescription] = useState<string>("")

  useEffect(() => {
    // Get error from URL query params
    const params = new URLSearchParams(window.location.search)
    const error = params.get("error")
    setErrorType(error)

    // Set error description based on error type
    switch (error) {
      case "Verification":
        setErrorDescription("The verification link you used is invalid or has expired.")
        break
      case "AccessDenied":
        setErrorDescription("You do not have permission to sign in.")
        break
      case "Configuration":
        setErrorDescription("There is a problem with the server configuration.")
        break
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "Callback":
      case "OAuthAccountNotLinked":
      case "EmailSignin":
      case "CredentialsSignin":
        setErrorDescription("There was a problem with the authentication process.")
        break
      default:
        setErrorDescription("An unknown error occurred during authentication.")
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 p-4">
      {/* Pixel art error animation */}
      <div className="mb-8 relative w-[120px] h-[120px] flex items-center justify-center">
        <div className="w-[80px] h-[80px] bg-[#8b5cf6] rounded-md relative border-[4px] border-[#4c1d95] shadow-[0_4px_0_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-white animate-pulse" />
          </div>
          {/* Pixel art warning/error details */}
          <div className="absolute -top-4 -right-4 w-5 h-5 bg-[#f43f5e] rounded-full border-2 border-white animate-bounce"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#f43f5e] rounded-full border-1 border-white"></div>
        </div>
      </div>

      <Card className="w-full max-w-md p-6 border-2 border-purple-500 bg-black/40 backdrop-blur-sm text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold tracking-tight font-[var(--font-press-start-2p)] text-shadow-[2px_2px_0_rgba(0,0,0,0.5)] -tracking-[0.5px]">Authentication Error</h1>

          <div className="h-[4px] w-[80%] mx-auto bg-[repeating-linear-gradient(to_right,transparent,transparent_4px,#a855f7_4px,#a855f7_8px)]"></div>

          <div className="space-y-2">
            <p className="text-sm text-purple-200">We encountered an error:</p>
            <p className="font-mono text-md bg-purple-900/50 py-1 px-2 rounded inline-block">
              {errorType || "Unknown Error"}
            </p>
          </div>

          <p className="text-sm text-purple-200">
            {errorDescription}
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <Link href="/login" className="w-full">
              <Button 
                variant="outline"
                className="bg-transparent border-purple-500 hover:bg-purple-900/50 text-white w-full relative border-[2px] after:content-[''] after:absolute after:bottom-[-2px] after:right-[-2px] after:w-[6px] after:h-[6px] after:bg-[#a855f7] after:clip-path-[polygon(100%_0,0%_100%,100%_100%)]"
              >
                Try Again
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button variant="ghost" className="text-purple-200 hover:text-white hover:bg-transparent w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
} 