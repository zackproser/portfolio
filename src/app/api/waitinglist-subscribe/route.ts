import { NextRequest, NextResponse } from "next/server";
import { getTagsFromReferrer } from "@/lib/subscriber-tags";
import { subscribeToKit } from "@/lib/kit-subscribe";

/**
 * Used to be a separate EmailOctopus list for product waitlists. Post-Kit
 * migration we collapse waitlists into the main list with a `waitlist:<slug>`
 * tag — keeps the subscriber in one segmentable place instead of fragmenting
 * audiences across multiple lists.
 */
export async function POST(req: NextRequest) {
	const { email, referrer, productSlug } = await req.json();

	if (!email) {
		return new NextResponse(
			JSON.stringify({ data: "Error: no valid email found in request" }),
			{ status: 400 },
		);
	}

	if (!productSlug) {
		return new NextResponse(
			JSON.stringify({ data: "Error: no product slug found in request" }),
			{ status: 400 },
		);
	}

	// Preserve referrer-derived segmentation alongside the waitlist tag, so
	// waitlist signups are routable by the same auto-tag rules as regular
	// signups (interest:*, vertical:*, source:*).
	const referrerTags = getTagsFromReferrer(referrer);
	const tags = [
		...new Set<string>([
			`waitlist:${productSlug}`,
			productSlug,
			...referrerTags,
		]),
	];

	const result = await subscribeToKit({
		email,
		tags,
	});

	if (!result.ok) {
		console.error(`[waitinglist] Kit subscribe failed for ${email}: ${result.error}`);
		return new NextResponse(
			JSON.stringify({ data: `Error: ${result.error}` }),
			{ status: 500 },
		);
	}

	return new NextResponse(
		JSON.stringify({
			data: `Successfully added ${email} to ${productSlug} waitlist`,
			subscriberId: result.subscriberId,
		}),
		{ status: 200 },
	);
}
