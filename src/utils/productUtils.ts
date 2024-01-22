import { sql } from "@vercel/postgres";

enum CourseStatus {
  ComingSoon = "coming-soon",
  InProgress = "in-progress",
  Available = "available",
}

interface ProductDetails {
  title: string;
  description: string;
  price_id: string;
  course_id: string;
  status: CourseStatus;
}

async function getProductDetails(slug: string): Promise<ProductDetails | null> {
  const result = await sql`
    SELECT title, description, price_id, course_id, status
    FROM Courses
    WHERE slug = ${slug}
  `;
  return result.rowCount > 0 ? (result.rows[0] as ProductDetails) : null;
}

export { type ProductDetails, CourseStatus, getProductDetails };
