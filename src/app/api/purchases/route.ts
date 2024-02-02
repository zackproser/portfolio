import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

import { ProductDetails } from "@/utils/productUtils";
import { sendReceiptEmail, SendReceiptEmailInput } from "@/lib/postmark";

export async function POST(req: NextRequest) {
	console.log("[POST] /api/purchases");

	const { sessionId, customerEmail, productSlug } = await req.json();

	// Look up the supplied product via its slug
	try {
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
		const response = await fetch(
			`${baseUrl}/api/products?product=${productSlug}`,
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

		// Look up the purchasing student's ID
		const studentRes = await sql`SELECT student_id, full_name FROM        
  Students WHERE email = ${customerEmail} `;
		if (studentRes.rowCount === 0) {
			return NextResponse.json(
				{ error: "Student not found" },
				{
					status: 404,
				},
			);
		}

		const { student_id: studentId, full_name: fullName } = studentRes.rows[0];

		console.log(`Retrieved student_id: ${studentId} and full_name:
			${fullName} for email: ${customerEmail} `);

		// Look up the course ID
		const courseRes = await sql`SELECT course_id FROM courses WHERE slug =
			${productSlug} `;
		if (courseRes.rowCount === 0) {
			return NextResponse.json(
				{ error: "Course not found" },
				{
					status: 404,
				},
			);
		}

		const { course_id: courseId } = courseRes.rows[0];

		await sql`                                                            
          INSERT INTO StripePayments(student_id, stripe_payment_id, amount,
				payment_status)
		VALUES(${studentId}, ${sessionId}, 0, 'paid')
			`;

		await sql`                                                            
          INSERT INTO CourseEnrollments(student_id, course_id)
		VALUES(${studentId}, ${courseId})                                  
        `;

		const sendReceiptEmailInput: SendReceiptEmailInput = {
			From: "orders@zackproser.com",
			To: customerEmail,
			TemplateAlias: "receipt",
			TemplateModel: {
				CustomerName: fullName,
				ProductURL: `${process.env.NEXT_PUBLIC_SITE_URL} /courses/${productSlug} `,
				ProductName: productDetails.title ?? "Online Learning Platform",
				Date: new Date().toLocaleDateString("en-US"),
				ReceiptDetails: {
					Description: productDetails.description,
					Amount: "150",
					SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL} /support`,
				},
				Total: "150",
				SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
				ActionURL: `${process.env.NEXT_PUBLIC_SITE_URL}/learn/${productSlug}/0`,
				CompanyName: "Zachary Proser's School for Hackers",
				CompanyAddress: "2416 Dwight Way Berkeley CA 94710",
			},
		};

		try {
			const messageSendingResponse = await sendReceiptEmail(
				sendReceiptEmailInput,
			);
			console.log(`Successfully sent receipt email to ${customerEmail}    
  with MessageID: ${messageSendingResponse.MessageID}`);
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
		console.error(`An error occurred: ${error}`);
		return NextResponse.json(
			{ error: "An unknown error occurred" },
			{
				status: 500,
			},
		);
	}
}
