import { NextRequest, NextResponse } from "next/server";
import { getProductDetails, ProductDetails } from "@/utils/productUtils";

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

	const productDetails: ProductDetails | null =
		await getProductDetails(productSlug);

	if (!productDetails) {
		throw new Error(`Could not find product with slug: ${productSlug}`);
	}

	return NextResponse.json({ ...productDetails }, { status: 200 });
}
