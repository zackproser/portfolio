import { sql } from "@vercel/postgres";

interface ProductDetails {
  title: string;
  description: string;
  price_id: string;
}

async function getProductDetails(slug: string): Promise<ProductDetails | null> {
  const result = await sql`
    SELECT title, description, price_id
    FROM Courses
    WHERE slug = ${slug}
  `;
  return result.rowCount > 0 ? result.rows[0] as ProductDetails : null;
}

export {
  type ProductDetails,
  getProductDetails
};

