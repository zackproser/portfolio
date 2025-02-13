import { NextRequest, NextResponse } from "next/server";
import { getProductDetails, ProductDetails } from "@/utils/productUtils";
import { sql } from '@vercel/postgres'
import { getArticleBySlug } from '@/lib/articles'

export async function GET(req: NextRequest) {
	console.log("GET /products");

	const productSlug = req.nextUrl.searchParams.get("product");
	const type = req.nextUrl.searchParams.get("type") as 'blog' | 'course' | 'video';

	if (!productSlug || !type) {
		return new NextResponse(
			JSON.stringify({ error: "Must supply valid product slug and type" }),
			{
				status: 400,
			},
		);
	}

	try {
		if (type === 'blog') {
			const article = await getArticleBySlug(productSlug)
			
			if (!article) {
				return NextResponse.json({ error: 'Article not found' }, { status: 404 })
			}

			return NextResponse.json(article)
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
