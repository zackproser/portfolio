import { sql } from "@vercel/postgres";

async function getUserIdFromEmail(email: string): Promise<number | null> {
  // Implement logic to fetch user ID from the database based on email
  // Return the user ID or null if not found
  const userRes = await sql`SELECT student_id FROM students WHERE email = ${email}`;
  return userRes.rowCount > 0 ? userRes.rows[0].student_id : null;
}

async function getPurchasedCourses(userId: number): Promise<number[]> {
  // Implement logic to fetch purchased courses from the database
  // Return an array of course IDs or details
  const purchasesRes = await sql`SELECT course_id from CourseEnrollments WHERE student_id = ${userId}`;
  return purchasesRes.rows.map(row => row.course_id);
}

async function userPurchasedCourse(email: string, courseId: number): Promise<boolean> {
  // Implement logic to check if a user has purchased a specific course
  // Return true if purchased, false otherwise
  const purchasesRes = await sql`SELECT course_id from CourseEnrollments WHERE student_id = (SELECT student_id FROM Students where email = ${email}) AND course_id = ${courseId}`;
  return purchasesRes.rowCount > 0;
}

export {
  getUserIdFromEmail,
  getPurchasedCourses,
  userPurchasedCourse
}