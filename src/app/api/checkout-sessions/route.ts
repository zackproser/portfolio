import { auth } from '../../../../auth'
import { NextResponse, NextRequest } from 'next/server'
import Stripe from 'stripe'
import { sql } from '@vercel/postgres'
import { importArticleMetadata } from '@/lib/articles'
import { importCourse } from '@/lib/courses'
import { sendReceiptEmail, SendReceiptEmailInput } from '@/lib/postmark'

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error('Missing STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2023-10-16'
})

export async function POST(req: NextRequest) {
	try {
		const session = await auth()
		if (!session?.user?.email) {
			return NextResponse.json(
				{ error: 'Must be signed in to make purchases' },
				{ status: 401 }
			)
		}

		const { product } = await req.json()

		// Get user ID from email
		const { rows: userRows } = await sql`
			SELECT id::int as id, email FROM users WHERE email = ${session.user.email}
		`

		if (!userRows.length) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			)
		}

		const userId = userRows[0].id
		console.log('Creating checkout session for user:', { userId, email: session.user.email, userIdType: typeof userId })

		// First check if this is a course purchase by looking up the slug
		const { rows: courseRows } = await sql`
			SELECT course_id, title, description, price_id, slug
			FROM courses 
			WHERE slug = ${product}
		`;

		if (courseRows.length > 0) {
			// Handle course purchase
			try {
				const course = courseRows[0];

				if (!course.price_id) {
					return NextResponse.json(
						{ error: 'Course price not set' },
						{ status: 400 }
					)
				}

				const checkoutSession = await stripe.checkout.sessions.create({
					mode: 'payment',
					payment_method_types: ['card'],
					ui_mode: 'embedded',
					line_items: [
						{
							price: course.price_id,
							quantity: 1,
						},
					],
					metadata: {
						type: 'course',
						slug: course.slug,
						userId: userId.toString(),
						courseId: course.course_id.toString()
					},
					return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
				})

				return NextResponse.json({ clientSecret: checkoutSession.client_secret })
			} catch (error) {
				console.error('Error creating checkout session for course:', error)
				return NextResponse.json(
					{ error: 'Failed to create course checkout session' },
					{ status: 500 }
				)
			}
		}

		// Handle article purchases
		if (product.startsWith('blog-')) {
			const articleSlug = product.replace('blog-', '')
			
			try {
				const article = await importArticleMetadata(`${articleSlug}/page.mdx`)

				if (!article.price) {
					return NextResponse.json(
						{ error: 'Article price not set' },
						{ status: 400 }
					)
				}

				const checkoutSession = await stripe.checkout.sessions.create({
					mode: 'payment',
					payment_method_types: ['card'],
					ui_mode: 'embedded',
					line_items: [
						{
							price_data: {
								currency: 'usd',
								product_data: {
									name: article.title,
									description: article.description,
									metadata: {
										type: 'article',
										slug: articleSlug,
										userId: userId
									},
								},
								unit_amount: article.price,
							},
							quantity: 1,
						},
					],
					metadata: {
						type: 'article',
						slug: articleSlug,
						userId: userId
					},
					return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
				})

				return NextResponse.json({ clientSecret: checkoutSession.client_secret })
			} catch (error) {
				console.error('Error creating checkout session for article:', error)
				return NextResponse.json(
					{ error: 'Article not found or invalid' },
					{ status: 404 }
				)
			}
		}

		return NextResponse.json(
			{ error: 'Invalid product type' },
			{ status: 400 }
		)

	} catch (error) {
		console.error('Error creating checkout session:', error)
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Failed to create checkout session' },
			{ status: 500 }
		)
	}
}

// Called by the /success page to get the payment status when rendering
// the checkout success message
export async function GET(req: NextRequest) {
	console.log("=== Starting checkout-sessions GET ===");
	console.log("Request URL:", req.url);
	console.log("Search params:", Object.fromEntries(req.nextUrl.searchParams.entries()));

	try {
		const sessionId = req.nextUrl.searchParams.get("session_id");
		if (!sessionId) {
			console.error("No session_id in request params");
			throw new Error("Session ID is missing");
		}
		console.log("Retrieved session_id:", sessionId);

		const session = await stripe.checkout.sessions.retrieve(sessionId);
		console.log("Stripe session retrieved:", {
			payment_status: session.payment_status,
			metadata: session.metadata,
			amount_total: session.amount_total
		});

		// If payment is successful, record the purchase and send email
		if (session.payment_status === 'paid' && session.metadata?.userId && session.metadata?.slug && session.metadata?.type) {
			const { userId, slug, type, courseId } = session.metadata;
			
			console.log('Processing successful payment for:', { userId, slug, type });
			
			// Record the purchase in the database based on type
			try {
				if (type === 'article') {
					await sql`
						INSERT INTO articlepurchases (user_id, article_slug, stripe_payment_id, amount)
						VALUES (${userId}::int, ${slug}, ${session.payment_intent as string}, ${session.amount_total})
						ON CONFLICT (user_id, article_slug) DO NOTHING
					`;
				} else if (type === 'course') {
					// Record in stripepayments for tracking
					console.log('Course purchase verification - values:', {
						userId,
						courseId,
						userIdType: typeof userId,
						courseIdType: typeof courseId,
						rawMetadata: session.metadata
					});

					// First insert into stripepayments
					await sql`
						INSERT INTO stripepayments (user_id, stripe_payment_id, amount, payment_status)
							VALUES (${userId}, ${session.payment_intent as string}, ${session.amount_total}, 'completed')
					`;
					
					// Then insert into courseenrollments
					await sql`
						INSERT INTO courseenrollments (user_id, course_id)
						VALUES (${userId}, ${courseId})
						ON CONFLICT (user_id, course_id) DO NOTHING
					`;
				}
				console.log('Successfully recorded purchase');
			} catch (sqlError) {
				console.error('Failed to record purchase:', sqlError);
				throw sqlError;
			}

			// Get user details
			const userResult = await sql`
				SELECT email, name FROM users WHERE id = ${userId}::int
			`;
			
			if (userResult.rows.length === 0) {
				throw new Error(`No user found with ID ${userId}`);
			}
			
			const user = userResult.rows[0];
			console.log('Found user:', { email: user.email, name: user.name });
			
			// Get content details based on type
			console.log('Attempting to get content details:', { type, slug });
			
			let content;
			if (type === 'article') {
				console.log('Fetching article content');
				content = await importArticleMetadata(`${slug}/page.mdx`);
			} else if (type === 'course') {
				console.log('Fetching course content from database');
				// For courses, get the details from the database instead of MDX
				const { rows } = await sql`
					SELECT title, description, slug
					FROM courses
					WHERE slug = ${slug}
				`;
				
				console.log('Course database query result:', { rowCount: rows.length, firstRow: rows[0] });
				
				if (!rows.length) {
					console.error('No course found in database with slug:', slug);
					throw new Error(`No course found with slug ${slug}`);
				}
				
				content = {
					title: rows[0].title,
					description: rows[0].description,
					slug: rows[0].slug,
					type: 'course'
				};
				console.log('Created course content object:', content);
			}

			if (!content) {
				console.error('Content lookup failed:', { type, slug });
				throw new Error(`No content found with slug ${slug}`);
			}
			console.log('Successfully found content:', { title: content.title, type });

			// Check if we've already sent an email
			const emailResult = await sql`
				SELECT id FROM email_notifications 
				WHERE user_id = ${userId}::int 
				AND content_type = ${type}
				AND content_slug = ${slug}
				AND email_type = 'purchase_confirmation'
			`;

			if (emailResult.rows.length === 0) {
				// Prepare and send email
				const emailInput: SendReceiptEmailInput = {
					From: "purchases@zackproser.com",
					To: user.email,
					TemplateAlias: "receipt",
					TemplateModel: {
						CustomerName: user.name || 'Valued Customer',
						ProductURL: `${process.env.NEXT_PUBLIC_SITE_URL}/${type === 'article' ? 'blog' : 'learn/courses'}/${slug}${type === 'course' ? '/0' : ''}`,
						ProductName: content.title,
						Date: new Date().toLocaleDateString('en-US'),
						ReceiptDetails: {
							Description: content.description || `Premium ${type === 'article' ? 'Article' : 'Course'} Access`,
							Amount: `$${session.amount_total! / 100}`,
							SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
						},
						Total: `$${session.amount_total! / 100}`,
						SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
						ActionURL: `${process.env.NEXT_PUBLIC_SITE_URL}/${type === 'article' ? 'blog' : 'learn/courses'}/${slug}${type === 'course' ? '/0' : ''}`,
						CompanyName: "Modern Coding",
						CompanyAddress: "2416 Dwight Way Berkeley CA 94710",
					},
				};

				try {
					const emailResponse = await sendReceiptEmail(emailInput);
					console.log('✅ Email sent successfully:', emailResponse);
					
					// Record that we sent the email
					await sql`
						INSERT INTO email_notifications (user_id, content_type, content_slug, email_type)
						VALUES (${userId}::int, ${type}, ${slug}, 'purchase_confirmation')
					`;
					console.log('✅ Recorded email notification');
				} catch (emailError) {
					console.error('Failed to send email:', emailError);
					throw emailError;
				}
			}
		}

		return new NextResponse(
			JSON.stringify({
				payment_status: session.payment_status,
				metadata: session.metadata,
			}),
			{
				status: 200,
			},
		);
	} catch (err: unknown) {
		console.error('Error processing checkout completion:', err);
		if (err instanceof Error) {
			return new NextResponse(JSON.stringify({ error: err.message }), {
				status: 500,
			});
		}
		return new NextResponse(JSON.stringify({ error: "Unknown Error" }), {
			status: 500,
		});
	}
}

export async function OPTIONS() {
	const respHeaders = new Headers();
	respHeaders.set("Allow", "POST, GET");
	respHeaders.set("Content-Type", "application/json");

	return NextResponse.next({
		request: {
			headers: respHeaders,
		},
	});
}
