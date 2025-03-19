import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is not defined in verify-payment");
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
}) : null;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Handle simulated payments for development
    if (sessionId.startsWith("sim_")) {
      console.log("Returning simulated payment verification for:", sessionId);
      return NextResponse.json({
        status: "complete",
        customerEmail: "dev@example.com",
        amount: 10000, // simulated $100.00
        metadata: {
          type: "project",
          isDeposit: "true",
        },
        paymentStatus: "paid",
      });
    }

    // For real payments, ensure Stripe is initialized
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe API key is not configured" },
        { status: 500 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "customer"],
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Return relevant payment information
    return NextResponse.json({
      status: session.status,
      customerEmail: session.customer_email,
      amount: session.amount_total ? session.amount_total / 100 : null,
      metadata: session.metadata,
      paymentStatus: session.payment_status,
    });
  } catch (error: any) {
    console.error("Error verifying payment:", error.message);
    return NextResponse.json(
      { error: "Failed to verify payment: " + error.message },
      { status: 500 }
    );
  }
} 