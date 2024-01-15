import { NextRequest, NextResponse } from 'next/server'

import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {

  console.log(`[POST] /api/purchases`)

  const { sessionId, customerEmail, courseId, paymentAmount } = await req.json()

  console.log(`[POST] sessionId: ${sessionId}`)
  console.log(`[POST] customerEmail: ${customerEmail}`)
  console.log(`[POST] courseId: ${courseId}`)

  const stripePaymentResult = await sql`
  INSERT INTO StripePayments (
    student_id, 
    stripe_payment_id,
    amount,
    payment_status
  )
  VALUES (
    (SELECT student_id FROM Students WHERE email = ${customerEmail}),
    ${sessionId},
    ${paymentAmount},
    'paid'
  )
  RETURNING *  
`

  const courseEnrollmentResult = await sql`
  INSERT INTO CourseEnrollments (student_id, course_id)
  VALUES (
    (SELECT student_id FROM Students WHERE email = ${customerEmail}),
    ${courseId}
  )
  RETURNING *
`

  return NextResponse.json({
    message: 'Database updated successfully'
  }, {
    status: 200,
  })

}
