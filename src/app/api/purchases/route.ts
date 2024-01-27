import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

import { sendReceiptEmail } from "@/lib/postmark";

export async function POST(req: NextRequest) {
	console.log("[POST] /api/purchases");

	const { sessionId, customerEmail, productSlug } = await req.json();

	console.log(`[POST] sessionId: ${sessionId}`);
	console.log(`[POST] customerEmail: ${customerEmail}`);
	console.log(`[POST] productSlug: ${productSlug}`);

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
	sendReceiptEmail();

	console.log(`Email sent to ${customerEmail}`);

	return NextResponse.json(
		{
			message: "Database updated successfully",
		},
		{
			status: 200,
		},
	);
}
