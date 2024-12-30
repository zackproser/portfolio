import { auth } from '../../../../auth'
import { NextResponse, NextRequest } from 'next/server'
import Stripe from 'stripe'
import { sql } from '@vercel/postgres'
import { importArticleMetadata } from '@/lib/articles'
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
	console.log("checkout-sessions GET");

	try {
		const sessionId = req.nextUrl.searchParams.get("session_id");
		if (!sessionId) {
			throw new Error("Session ID is missing");
		}

		const session = await stripe.checkout.sessions.retrieve(sessionId);
		console.log(`Session metadata:`, session.metadata);

		// If payment is successful, record the purchase and send email
		if (session.payment_status === 'paid' && session.metadata?.type === 'article') {
			const { userId, slug } = session.metadata;
			
			console.log('Processing successful payment for:', { userId, slug });
			
			// Record the purchase in the database
			try {
				await sql`
					INSERT INTO articlepurchases (user_id, article_slug, stripe_payment_id, amount)
					VALUES (${userId}::int, ${slug}, ${session.payment_intent as string}, ${session.amount_total})
					ON CONFLICT (user_id, article_slug) DO NOTHING
				`;
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
			
			// Get article details
			const article = await importArticleMetadata(`${slug}/page.mdx`);
			if (!article) {
				throw new Error(`No article found with slug ${slug}`);
			}
			console.log('Found article:', { title: article.title });

			// Check if we've already sent an email
			const emailResult = await sql`
				SELECT id FROM email_notifications 
				WHERE user_id = ${userId}::int 
				AND article_slug = ${slug} 
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
						ProductURL: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
						ProductName: article.title,
						Date: new Date().toLocaleDateString('en-US'),
						ReceiptDetails: {
							Description: article.description || 'Premium Article Access',
							Amount: `$${session.amount_total! / 100}`,
							SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
						},
						Total: `$${session.amount_total! / 100}`,
						SupportURL: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
						ActionURL: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
						CompanyName: "Modern Coding",
						CompanyAddress: "2416 Dwight Way Berkeley CA 94710",
					},
				};

				try {
					const emailResponse = await sendReceiptEmail(emailInput);
					console.log('✅ Email sent successfully:', emailResponse);
					
					// Record that we sent the email
					await sql`
						INSERT INTO email_notifications (user_id, article_slug, email_type)
						VALUES (${userId}::int, ${slug}, 'purchase_confirmation')
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
