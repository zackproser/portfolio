import { NextRequest, NextResponse } from "next/server";
import { getTagsFromReferrer } from "@/lib/subscriber-tags";
import { subscribeToKit } from "@/lib/kit-subscribe";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (body.email === "" || !body.email) {
		return new NextResponse(
			JSON.stringify({ data: "Error: no valid email found in request" }),
			{ status: 400 },
		);
	}

	// Auto-tag based on referrer page (e.g., voice-ai, real-estate, etc.)
	const referrerTags = getTagsFromReferrer(body.referrer);
	const explicitTags = body.tags && Array.isArray(body.tags) ? body.tags : [];
	const allTags = [...new Set<string>([...explicitTags, ...referrerTags])];

	const result = await subscribeToKit({
		email: body.email,
		tags: allTags,
	});

	if (!result.ok) {
		console.error(`[form] Kit subscribe failed for ${body.email}: ${result.error}`);
		return new NextResponse(
			JSON.stringify({ data: `Error: ${result.error}` }),
			{ status: 500 },
		);
	}

	if (result.failedTags.length > 0) {
		// Subscriber created successfully; some tags didn't stick. Log + report
		// success to the caller — the sub is on the list, the tags are best-effort.
		console.warn(
			`[form] subscribed ${body.email} (id ${result.subscriberId}); ${result.failedTags.length}/${allTags.length} tags failed:`,
			result.failedTags,
		);
	}

	return new NextResponse(
		JSON.stringify({
			data: `Successfully subscribed ${body.email}`,
			subscriberId: result.subscriberId,
			tagsApplied: result.appliedTags,
		}),
		{ status: 200 },
	);
}
