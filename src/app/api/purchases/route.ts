import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { Content } from "@/lib/shared-types";
import { ProductDetails } from "@/utils/productUtils";
import { sendReceiptEmail, SendReceiptEmailInput } from "@/lib/postmark";

export async function POST(req: NextRequest) {
	console.log("[POST] /api/purchases");

	const { sessionId, customerEmail, productSlug, type } = await req.json();

	// Look up the supplied product via its slug
	try {
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
		const response = await fetch(
			`${baseUrl}/api/products?product=${productSlug}&type=${type}`,
		);
		console.dir(response);
		console.log(`response.ok: ${response.ok}`);

		if (!response.ok) {
			return NextResponse.json(
				{ error: "Product not found" },
				{
					status: 400,
				},
			);
		}

		const productDetails: ProductDetails | null = await response.json();

		console.log(`productDetails: ${JSON.stringify(productDetails)}`);

		if (!productDetails) {
			return NextResponse.json(
				{ error: "Product not found" },
				{
					status: 400,
				},
			);
		}

		// Look up the purchasing user's ID
		const userRes = await sql`SELECT id, name FROM users WHERE email = ${customerEmail}`;
		if (userRes.rowCount === 0) {
			return NextResponse.json(
				{ error: "User not found" },
				{
					status: 404,
				},
			);
		}

		const { id: userId, name } = userRes.rows[0];
		const amount = productDetails.commerce?.price || 0;

		console.log(`Recording purchase for user ${userId} (${name}) - ${type} ${productSlug}`);

		// Record the purchase in the appropriate table
		if (type === 'blog') {
			await sql`
				INSERT INTO articlepurchases (
					user_id, 
					article_slug, 
					stripe_payment_id, 
					amount
				) VALUES (
					${userId}, 
					${productSlug}, 
					${sessionId}, 
					${amount}
				)
			`;
		} else if (type === 'course') {
			// Record in coursepurchases
			await sql`
				INSERT INTO coursepurchases (
					user_id, 
					course_slug, 
					stripe_payment_id, 
					amount
				) VALUES (
					${userId}, 
					${productSlug}, 
					${sessionId}, 
					${amount}
				)
			`;

			// Also record in courseenrollments if the course exists
			const courseRes = await sql`SELECT course_id FROM courses WHERE slug = ${productSlug}`;
			if (courseRes.rowCount > 0) {
				const { course_id: courseId } = courseRes.rows[0];
				await sql`
					INSERT INTO courseenrollments (user_id, course_id)
					VALUES (${userId}, ${courseId})
				`;
			}
		}

		// Record in stripepayments for historical data
		await sql`
			INSERT INTO stripepayments (
				user_id, 
				stripe_payment_id, 
				amount, 
				payment_status
			) VALUES (
				${userId}, 
				${sessionId}, 
				${amount}, 
				'paid'
			)
		`;

		const sendReceiptEmailInput: SendReceiptEmailInput = {
			From: "orders@zackproser.com",
			To: customerEmail,
			TemplateAlias: "receipt",
			TemplateModel: {
				CustomerName: name,
				ProductURL: `${process.env.NEXT_PUBLIC_SITE_URL}/${type === 'course' ? 'courses' : 'blog'}/${productSlug}`,
				ProductName: productDetails.title ?? "Premium Content",
				Date: new Date().toLocaleDateString("en-US"),
				ReceiptDetails: {
					Description: productDetails.description,
					Amount: (amount / 100).toString(),
					SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
				},
				Total: (amount / 100).toString(),
				SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
				ActionURL: `${process.env.NEXT_PUBLIC_SITE_URL}/${type === 'course' ? 'learn' : 'blog'}/${productSlug}`,
				CompanyName: "Zachary Proser's School for Hackers",
				CompanyAddress: "2416 Dwight Way Berkeley CA 94710",
			},
		};

		try {
			const messageSendingResponse = await sendReceiptEmail(sendReceiptEmailInput);
			console.log(`Successfully sent receipt email to ${customerEmail} with MessageID: ${messageSendingResponse.MessageID}`);
		} catch (error) {
			console.error(`Failed to send receipt email: ${error}`);
		}

		return NextResponse.json(
			{
				message: "Successfully processed purchase",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(`An error occurred:`, error);
		return NextResponse.json(
			{ error: "An unknown error occurred" },
			{
				status: 500,
			},
		);
	}
}
