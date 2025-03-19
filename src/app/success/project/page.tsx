"use client";

import { useEffect, useState, Suspense } from "react";
import { Container } from "@/components/Container";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    // If sessionId starts with "sim_", it's a simulated payment (for dev without Stripe)
    if (sessionId.startsWith("sim_")) {
      console.log("Detected simulated payment ID:", sessionId);
      setPaymentInfo({
        status: "complete",
        amount: "Simulated payment (development mode)",
        customerEmail: "test@example.com",
        paymentStatus: "paid",
      });
      setLoading(false);
      return;
    }

    // Fetch payment details for real payments
    fetch(`/api/verify-payment?session_id=${sessionId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to verify payment");
        }
        return res.json();
      })
      .then((data) => {
        setPaymentInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error verifying payment:", err);
        setError(err.message || "Failed to verify payment");
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <Container className="mt-16 sm:mt-32">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <span className="ml-3">Verifying payment...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-16 sm:mt-32">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/10 p-6">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
            Error verifying payment
          </h3>
          <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-16 sm:mt-32">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-6 rounded-lg mb-6">
          <p className="text-lg mb-3">
            Thank you for your deposit payment. Your project has been scheduled!
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            I&apos;ll be in touch within 24 hours to discuss the next steps and begin the development process.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/">
              Return to Homepage
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/services">
              View More Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          A receipt has been sent to your email address.
        </p>
      </div>
    </Container>
  );
}

export default function ProjectSuccessPage() {
  return (
    <Suspense fallback={
      <Container className="mt-16 sm:mt-32">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <span className="ml-3">Loading...</span>
        </div>
      </Container>
    }>
      <SuccessContent />
    </Suspense>
  );
} 