import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

import { ProductDetails } from "@/utils/productUtils";

import { sendReceiptEmail, SendReceiptEmailInput } from "@/lib/postmark";

export async function POST(req: NextRequest) {
	console.log("[POST] /api/purchases");

	const { sessionId, customerEmail, productSlug } = await req.json();

	// Get the product details
	let productDetails: ProductDetails | null = null;
	try {
		const response = await fetch("/api/products?product=${productSlug}");
		if (!response.ok) {
			return NextResponse.json(JSON.stringify({ error: "Product not found" }), {
				status: 400,
			});
		}
		productDetails = await response.json();
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(`Error fetching product details: ${error.message}`);
			return NextResponse.json(
				JSON.stringify({ error: "An unknown error occured" }),
				{
					status: 500,
				},
			);
		}
	}

	if (!productDetails) {
		return NextResponse.json(JSON.stringify({ error: "Product not found" }), {
			status: 400,
		});
	}

	const studentRes =
		await sql`SELECT student_id, full_name FROM Students WHERE email = ${customerEmail}`;
	const studentId = studentRes.rows[0].student_id;
	const fullName = studentRes.rows[0].full_name;
	console.log(
		`Retrieved student_id: ${studentId} and full_name: ${fullName} for email: ${customerEmail}`,
	);

	if (studentId === null) {
		throw new Error(
			`Could not find student_id for user email: ${customerEmail}`,
		);
	}

	const stripePaymentResult = await sql`
  INSERT INTO StripePayments (
    student_id, 
    stripe_payment_id,
    amount,
    payment_status
  )
  VALUES (
    ${studentId},
    ${sessionId},
    0,
    'paid'
  )
  RETURNING *  
`;

	const courseRes =
		await sql`SELECT course_id FROM courses where slug = ${productSlug}`;
	const courseId = courseRes.rows[0].course_id;
	console.log(`Retrieved course_id: ${courseId} for slug: ${productSlug}`);

	const courseEnrollmentResult = await sql`
  INSERT INTO CourseEnrollments (student_id, course_id)
  VALUES (
    ${studentId},
    ${courseId}
  )
  RETURNING *
`;
	// Send transactional email letting the user know their purchase was successful
	// This also results in them having an email they can search for / find later as
	// another way to access their course

	// Create the SendReceiptEmail input
	const sendReceiptEmailInput: SendReceiptEmailInput = {
		From: "orders@zackproser.com",
		To: customerEmail,
		TemplateAlias: "receipt",
		TemplateModel: {
			CustomerName: fullName,
			ProductURL: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${productSlug}`,
			ProductName:
				productDetails.title ?? "Zachary Proser's School for Hackers",
			Date: String(new Date().toLocaleDateString("en-US")),
			ReceiptDetails: {
				Description: productDetails.description,
				Amount: "150",
				SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
			},
			Total: "150",
			SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
			ActionURL: "",
			CompanyName: "Zachary Proser's School for Hackers",
			CompanyAddress: "2416 Dwight Way Berkeley CA, 94710",
		},
	};

	// Send the receipt email to the purchasing user
	sendReceiptEmail(sendReceiptEmailInput)
		.then((messageSendingResponse) => {
			if (messageSendingResponse.MessageID) {
				console.log(
					`Successfully sent receipt email to ${customerEmail} with MessageID: ${messageSendingResponse.MessageID}`,
				);
			}
		})
		.catch((error: unknown) => {
			if (error instanceof Error) {
				console.error(error.message);
			}
		});

	return NextResponse.json(
		{
			message: "Successfully processed purchase",
		},
		{
			status: 200,
		},
	);
}
