import { NextRequest, NextResponse } from "next/server";
import { getTagsFromReferrer } from "@/lib/subscriber-tags";
import { subscribeToResend } from "@/lib/resend-subscribe";

/**
 * Used to be a separate EmailOctopus list for product waitlists. Post-Resend
 * migration we collapse waitlists into the main audience with a
 * `waitlist:<slug>` tag forwarded on the signup event — keeps the subscriber
 * in one segmentable place instead of fragmenting audiences across multiple
 * lists.
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

	// Preserve referrer-derived segmentation alongside the waitlist tag so
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

	const result = await subscribeToResend({
		email,
		tags,
	});

	if (!result.ok) {
		console.error(`[waitinglist] Resend subscribe failed for ${email}: ${result.error}`);
		return new NextResponse(
			JSON.stringify({ data: `Error: ${result.error}` }),
			{ status: 500 },
		);
	}

	if (result.eventSendWarning) {
		console.warn(`[waitinglist] Resend event send warning: ${result.eventSendWarning}`);
	}

	if (result.topicWarning) {
		console.warn(`[waitinglist] Resend topic warning: ${result.topicWarning}`);
	}

	return new NextResponse(
		JSON.stringify({
			data: `Successfully added ${email} to ${productSlug} waitlist`,
		}),
		{ status: 200 },
	);
}
