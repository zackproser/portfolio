import { NextRequest, NextResponse } from "next/server";
import { sendFreeChaptersEmail } from "@/lib/postmark";
import { getContentWithComponentByDirectorySlug } from "@/lib/content-handlers";
import { recordFreeChapterRequest, markFreeChapterRequestFulfilled } from "@/lib/free-chapters";
import { getTagsFromReferrer } from "@/lib/subscriber-tags";
import { subscribeToResend } from "@/lib/resend-subscribe";
import { auth } from "../../../../auth";

export async function POST(req: NextRequest) {
	console.log(`📬 [API] Received free chapters request`);

	const { email, productSlug, referrer } = await req.json();
	console.log(
		`📬 [API] Request data: email=${email}, productSlug=${productSlug}, referrer=${referrer || 'none'}`,
	);

	if (!email) {
		console.log(`📬 [API] Rejecting request - missing email`);
		return new NextResponse(
			JSON.stringify({ data: "Error: no valid email found in request" }),
			{ status: 400 },
		);
	}

	if (!productSlug) {
		console.log(`📬 [API] Rejecting request - missing productSlug`);
		return new NextResponse(
			JSON.stringify({ data: "Error: no product slug found in request" }),
			{ status: 400 },
		);
	}

	// Subscribe via Resend. Tags: gated-content marker + auto-tags from referrer.
	const referrerTags = getTagsFromReferrer(referrer || '');
	const allTags = [
		...new Set<string>([`free-chapters-${productSlug}`, ...referrerTags]),
	];

	console.log(`📬 [API] Subscribing ${email} to Resend with ${allTags.length} tags`);
	const subResult = await subscribeToResend({ email, tags: allTags });
	if (!subResult.ok) {
		console.error(`📬 [API] Resend subscribe failed: ${subResult.error}`);
		return new NextResponse(
			JSON.stringify({ success: false, error: `Failed to subscribe: ${subResult.error}` }),
			{ status: 500 },
		);
	}
	console.log(`📬 [API] Resend subscription successful (id ${subResult.contactId})`);
	if (subResult.eventSendWarning) {
		console.warn(`📬 [API] Resend event send warning: ${subResult.eventSendWarning}`);
	}
	if (subResult.topicWarning) {
		console.warn(`📬 [API] Resend topic warning: ${subResult.topicWarning}`);
	}

	try {
		console.log(`📬 [API] Loading content for product slug: ${productSlug}`);
		const contentResult = await getContentWithComponentByDirectorySlug(
			'blog',
			productSlug,
		);

		if (!contentResult) {
			console.error(`🚨 [API] Failed to load content for product: ${productSlug}`);
			return NextResponse.json(
				{ error: "Failed to load chapter content." },
				{ status: 500 },
			);
		}

		const { content } = contentResult;

		console.log(
			`📬 [API] Sending free chapter email for ${email} - Chapter: ${content.title}, Product: ${content.title}`,
		);

		await sendFreeChaptersEmail({
			To: email,
			ProductName: content.title || 'Your Requested Content',
			ProductSlug: productSlug,
		});

		console.log(`📬 [API] Free chapters email requested via Postmark for ${email}`);

		const session = await auth();
		const userId = session?.user?.id || undefined;
		console.log(
			`📬 [API] User authentication status: ${userId ? 'Authenticated' : 'Not authenticated'}`,
		);

		console.log(`📬 [API] Recording free chapter request in database`);
		await recordFreeChapterRequest(email, productSlug, userId);
		console.log(`📬 [API] Free chapter request recorded successfully`);

		console.log(`📬 [API] Marking free chapter request as fulfilled in database`);
		await markFreeChapterRequestFulfilled(email, productSlug);
		console.log(`📬 [API] Free chapter request marked as fulfilled`);

		console.log(`📬 [API] Free chapters request process completed successfully`);
		return new NextResponse(
			JSON.stringify({
				success: true,
				message: `Successfully sent free chapters for ${productSlug} to ${email}`,
			}),
			{ status: 200 },
		);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`📬 [API] Error processing free chapters request:`, error.message);
			return new NextResponse(
				JSON.stringify({ success: false, error: error.message }),
				{ status: 500 },
			);
		}
		console.error(`📬 [API] Unknown error processing free chapters request:`, error);
		return new NextResponse(
			JSON.stringify({ success: false, error: "An unknown error occurred" }),
			{ status: 500 },
		);
	}
}
