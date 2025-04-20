import { NextRequest, NextResponse } from "next/server";
import { sendFreeChaptersEmail } from "@/lib/postmark";
import { getContentWithComponentByDirectorySlug, getAllPurchasableContent, getContentSlugs } from "@/lib/content-handlers";
import { recordFreeChapterRequest, markFreeChapterRequestFulfilled } from "@/lib/free-chapters";
import { auth } from "../../../../auth";

export async function POST(req: NextRequest) {
	console.log(`📬 [API] Received free chapters request`);
	
	// Get data submitted in the request's body.
	const { email, productSlug, referrer } = await req.json();
	console.log(`📬 [API] Request data: email=${email}, productSlug=${productSlug}, referrer=${referrer || 'none'}`);

	// If email is missing, return an error.
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

	// First, subscribe the user to the newsletter using EmailOctopus
	console.log(`📬 [API] Preparing to subscribe user to EmailOctopus`);
	const emailOctopusAPIKey = process.env.EMAIL_OCTOPUS_API_KEY;
	const emailOctopusListId = process.env.EMAIL_OCTOPUS_LIST_ID;
	const emailOctopusAPIEndpoint = `https://emailoctopus.com/api/1.6/lists/${emailOctopusListId}/contacts`;
	
	console.log(`📬 [API] EmailOctopus configuration: API Key exists=${!!emailOctopusAPIKey}, List ID exists=${!!emailOctopusListId}`);

	const subscriptionData = {
		api_key: emailOctopusAPIKey,
		email_address: email,
		fields: {
			Referrer: referrer || productSlug,
		},
		tags: [`free-chapters-${productSlug}`],
		status: "SUBSCRIBED",
	};

	const requestOptions = {
		crossDomain: true,
		method: "POST",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify(subscriptionData),
	};

	try {
		// Subscribe the user to the newsletter
		console.log(`📬 [API] Sending subscription request to EmailOctopus`);
		const subscriptionResponse = await fetch(emailOctopusAPIEndpoint, requestOptions);
		
		if (!subscriptionResponse.ok) {
			const errorText = await subscriptionResponse.text();
			console.error(`📬 [API] EmailOctopus subscription failed: ${subscriptionResponse.status} ${subscriptionResponse.statusText}`, errorText);
			throw new Error(`Failed to subscribe: ${subscriptionResponse.statusText}`);
		}
		
		console.log(`📬 [API] EmailOctopus subscription successful`);

		// Get the product details to include in the email
		console.log(`📬 [API] Loading content for product slug: ${productSlug}`);
		const contentResult = await getContentWithComponentByDirectorySlug(
			'blog',
			productSlug
		);
		
		if (!contentResult) {
			console.error(`🚨 [API] Failed to load content for product: ${productSlug}`);
			return NextResponse.json({ error: "Failed to load chapter content." }, { status: 500 });
		}
		
		// Extract the content (metadata) and the MDX component
		const { MdxContent, content } = contentResult;

		console.log(`📬 [API] Content loaded successfully for: ${productSlug}`);
		console.log(`📬 [API] Sending free chapter email for ${email} - Chapter: ${content.title}, Product: ${content.title}`);

		await sendFreeChaptersEmail({
			To: email,
			ProductName: content.title || 'Your Requested Content',
			ProductSlug: productSlug,
		});

		console.log(`📬 [API] Free chapters email requested via Postmark for ${email}`);

		// Get the current user session (if any)
		console.log(`📬 [API] Checking for authenticated user session`);
		const session = await auth();
		const userId = session?.user?.id || undefined; // Ensure userId is string | undefined, not null
		console.log(`📬 [API] User authentication status: ${userId ? 'Authenticated' : 'Not authenticated'}`);

		// Record the free chapter request in the database
		console.log(`📬 [API] Recording free chapter request in database`);
		await recordFreeChapterRequest(email, productSlug, userId);
		console.log(`📬 [API] Free chapter request recorded successfully`);

		// Update the database to mark the request as fulfilled
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