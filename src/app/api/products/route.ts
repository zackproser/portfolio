import { NextRequest, NextResponse } from "next/server";
import { getProductDetails, ProductDetails } from "@/utils/productUtils";
import { sql } from '@vercel/postgres'
import { getAllArticles } from '@/lib/articles'

export async function GET(req: NextRequest) {
	console.log("GET /products");

	const productSlug = req.nextUrl.searchParams.get("product");

	if (!productSlug) {
		return new NextResponse(
			JSON.stringify({ error: "Must supply valid product slug" }),
			{
				status: 400,
			},
		);
	}

	try {
		// Check if this is an article slug
		if (productSlug.startsWith('blog-')) {
			// Remove 'blog-' prefix to get the actual article slug
			const articleSlug = productSlug.replace('blog-', '')
			const articles = await getAllArticles([articleSlug])
			
			if (articles.length === 0) {
				return NextResponse.json({ error: 'Article not found' }, { status: 404 })
			}

			const article = articles[0]
			return NextResponse.json({
				title: article.title,
				status: 'available',
				price_id: article.commerce?.stripe_price_id,
				course_id: null,
				type: 'article'
			})
		}

		// Existing product lookup logic
		const { rows } = await sql`
			SELECT * FROM courses WHERE slug = ${productSlug}
		`

		if (rows.length === 0) {
			return NextResponse.json({ error: 'Product not found' }, { status: 404 })
		}

		return NextResponse.json(rows[0])
	} catch (error) {
		console.error('Error fetching product:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
