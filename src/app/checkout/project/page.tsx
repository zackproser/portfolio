"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Container } from "@/components/Container";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Initialize Stripe outside component to avoid re-initialization
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const ProjectCheckoutPage = () => {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  const amount = searchParams.get("amount");
  const total = searchParams.get("total");
  const email = searchParams.get("email");
  const description = searchParams.get("description");

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Validate parameters
  useEffect(() => {
    if (!amount || isNaN(Number(amount)) || !email) {
      setError("Invalid checkout parameters");
      setLoading(false);
      return;
    }
  }, [amount, email]);

  // Fetch client secret for checkout
  useEffect(() => {
    if (error || !amount || !email) return;

    setLoading(true);
    setError("");

    const payload = {
      amount: Number(amount),
      email,
      description: description || "Next.js AI Development Project (50% Deposit)",
      total: total ? Number(total) : undefined,
      type: "project"
    };

    fetch("/api/project-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Project checkout session response:", data);
        if (data.error) {
          throw new Error(data.error);
        }
        if (!data.clientSecret) {
          throw new Error("No client secret returned");
        }
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error creating checkout session:", err);
        setError(err.message || "Failed to initialize checkout");
        setLoading(false);
      });
  }, [amount, email, description, total, error]);

  if (error) {
    return (
      <Container className="mt-16 sm:mt-32">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/10 p-4">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Error initializing checkout
          </h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/calculator">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to calculator
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-16 sm:mt-32">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <span className="ml-3">Initializing checkout...</span>
        </div>
      </Container>
    );
  }

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(amount));

  return (
    <Container className="mt-16 sm:mt-32" size="lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Project Deposit Payment</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          50% Deposit Payment: {formattedAmount}
        </p>
      </div>
      
      <div id="checkout" className="bg-zinc-50 dark:bg-black min-h-[500px] p-4 rounded-lg w-full">
        {clientSecret ? (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <div className="text-center text-gray-500">
            Waiting for checkout initialization...
          </div>
        )}
      </div>
    </Container>
  );
}

export default function ProjectCheckoutPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectCheckoutPage />
    </Suspense>
  );
} 