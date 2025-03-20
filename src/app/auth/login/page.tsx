'use client';
import { use, useState } from "react";
import { signIn } from "next-auth/react";
import { MailOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignInPage(
  props: {
    searchParams: Promise<{ callbackUrl?: string }>
  }
) {
  const searchParams = use(props.searchParams);
  const [email, setEmail] = useState("");
  
  const {
    callbackUrl
  } = searchParams;

  const finalCallbackUrl = callbackUrl || '/';

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    // Store email in session storage for the verify-request page
    sessionStorage.setItem("signInEmail", email);
    
    // Pass email as query param to the verify-request page that Auth.js will redirect to
    signIn("email", { 
      email, 
      callbackUrl: finalCallbackUrl,
      redirect: true
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 p-4">
      {/* Pixel art animation */}
      <div className="mb-8 relative w-[120px] h-[120px] flex items-center justify-center">
        <div className="w-[80px] h-[80px] bg-[#8b5cf6] rounded-md relative border-[4px] border-[#4c1d95] shadow-[0_4px_0_rgba(0,0,0,0.3)] animate-[float_3s_ease-in-out_infinite]">
          <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-white">
            <MailOpen className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md p-6 border-2 border-purple-500 bg-black/40 backdrop-blur-sm text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold tracking-tight font-[var(--font-press-start-2p)] text-shadow-[2px_2px_0_rgba(0,0,0,0.5)] -tracking-[0.5px]">Almost There!</h1>
          
          <div className="h-[4px] w-[80%] mx-auto bg-[repeating-linear-gradient(to_right,transparent,transparent_4px,#a855f7_4px,#a855f7_8px)]"></div>
          
          <p className="text-sm text-purple-200">
            Sign in with your email to access the best of <span className="font-[var(--font-press-start-2p)] text-purple-100 text-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">Modern Coding</span>. 
          </p>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2 text-left">
              <label htmlFor="email" className="block text-sm font-medium text-purple-200">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                className="w-full px-3 py-2 rounded-md bg-purple-900/50 border-2 border-purple-500 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-transparent border-2 border-purple-500 hover:bg-purple-900/50 text-white relative after:content-[''] after:absolute after:bottom-[-2px] after:right-[-2px] after:w-[6px] after:h-[6px] after:bg-[#a855f7] after:clip-path-[polygon(100%_0,0%_100%,100%_100%)]"
            >
              Sign in with Magic Link
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

function ProviderIcon({ provider, ...props }: { provider: string; className?: string }) {
  switch (provider) {
    case 'GitHub':
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    default:
      return null;
  }
} 