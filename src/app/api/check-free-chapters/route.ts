import { NextRequest, NextResponse } from "next/server";
import { hasRequestedFreeChapters } from "@/lib/free-chapters";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const productSlug = url.searchParams.get("productSlug");

  if (!email || !productSlug) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const hasRequested = await hasRequestedFreeChapters(email, productSlug);
    
    return NextResponse.json(
      { hasRequested },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking free chapter request status:", error);
    
    return NextResponse.json(
      { error: "Failed to check request status" },
      { status: 500 }
    );
  }
} 