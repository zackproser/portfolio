import { NextRequest, NextResponse } from "next/server";
import { getTagsFromReferrer } from "@/lib/subscriber-tags";
import { subscribeToResend } from "@/lib/resend-subscribe";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
	const body = await req.json();

	// Honeypot check: if the hidden field is filled, reject silently
	if (body.hp && body.hp.trim() !== "") {
		return new NextResponse(
			JSON.stringify({ data: "Successfully subscribed" }),
			{ status: 200 },
		);
	}

	if (body.email === "" || !body.email) {
		return new NextResponse(
			JSON.stringify({ data: "Error: no valid email found in request" }),
			{ status: 400 },
		);
	}

	// Auto-tag based on referrer page (e.g., voice-ai, real-estate, etc.).
	// Tags are forwarded as `data.tags` on the fired `newsletter.signup`
	// event so Resend automations can branch on them.
	const referrerTags = getTagsFromReferrer(body.referrer);
	const explicitTags = body.tags && Array.isArray(body.tags) ? body.tags : [];
	const allTags = [...new Set<string>([...explicitTags, ...referrerTags])];

	const result = await subscribeToResend({
		email: body.email,
		tags: allTags,
	});

	if (!result.ok) {
		console.error(`[form] Resend subscribe failed for ${body.email}: ${result.error}`);
		return new NextResponse(
			JSON.stringify({ data: `Error: ${result.error}` }),
			{ status: 500 },
		);
	}

	if (result.eventSendWarning) {
		console.warn(`[form] Resend event send warning: ${result.eventSendWarning}`);
	}

	if (result.topicWarning) {
		console.warn(`[form] Resend topic warning: ${result.topicWarning}`);
	}

	return new NextResponse(
		JSON.stringify({
			data: `Successfully subscribed ${body.email}`,
		}),
		{ status: 200 },
	);
}
