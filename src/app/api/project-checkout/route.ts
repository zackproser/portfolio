import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(stripeSecretKey || "", {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, email, description, total } = body;

    console.log("Checkout request:", { amount, email, description, total });

    if (!amount || !email) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe API key is not configured" },
        { status: 500 }
      );
    }

    // Get host from headers to create absolute URLs
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;
    
    console.log("Generated base URL:", baseUrl);

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100);

    try {
      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Next.js AI Development Project",
                description: description || "50% Deposit Payment",
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          type: "project",
          totalAmount: total ? total.toString() : amount.toString(),
          isDeposit: "true",
        },
        customer_email: email,
        mode: "payment",
        success_url: `${baseUrl}/success/project?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/calculator`,
      });

      console.log("Stripe session created:", { 
        id: session.id, 
        url: session.url
      });

      if (!session.url) {
        console.error("Stripe session created but no URL was returned");
        return NextResponse.json(
          { error: "No URL returned from Stripe" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        redirectUrl: session.url,
        sessionId: session.id,
      });
    } catch (stripeError: any) {
      console.error("Stripe error:", stripeError.message);
      return NextResponse.json(
        { error: `Stripe error: ${stripeError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in project checkout:", error.message);
    return NextResponse.json(
      { error: `Failed to create checkout session: ${error.message}` },
      { status: 500 }
    );
  }
} 