import { sql } from "@vercel/postgres";
import { type AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

declare module "next-auth" {
  interface Profile {
    login?: string;
  }
}

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(`signIn callback: %o, %o, %o, %o, %o`, user, account, profile, email, credentials)

      // Extract GitHub profile ID from 'account' 
      const githubUsername: string = profile && profile.login! ? profile.login! : 'unknown';
      const userFullName: string = profile && profile.name ? profile.name : 'unknown';
      const userEmailAddress: string = profile && profile.email ? profile.email : 'unknown';

      console.log(`signIn callback githubUsername: ${githubUsername}, userFullName: ${userFullName}, userEmailAddress: ${userEmailAddress}`)

      try {
        // Check if student record already exists
        const existingStudent = await sql`
      SELECT * 
      FROM students 
      WHERE github_username = ${githubUsername}
    `;

        let studentId;

        if (existingStudent.rowCount > 0) {
          // Student found, use id
          studentId = existingStudent.rows[0].student_id;
        } else {
          // Create new student 
          const createRes = await sql`
        INSERT INTO students (github_username, full_name, email)
        VALUES (${githubUsername}, ${userFullName}, ${userEmailAddress})
        RETURNING student_id
      `;
          studentId = createRes.rows[0].student_id;
        }

        // Insert login record into 'logins' table
        await sql`
          INSERT INTO logins (student_id) VALUES (${studentId})
        `;
      } catch (error) {
        console.error(error);
      }

      return true;
    },
    async session({ session, user, token }) {
      console.log(`session method callback: %o, %o, %o`, session, user, token)

      console.log(`session.user.email: ${session!.user!.email}`)

      const userId = await getUserIdFromEmail(session!.user!.email!);

      // Add purchased courses to the session object
      session!.user!.purchased_courses = await getPurchasedCourses(Number(userId));

      console.log(`session before return: %o`, session)

      return {
        ...session,
      }
    }
  }
} as AuthOptions;

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
