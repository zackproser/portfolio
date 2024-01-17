import { sql } from "@vercel/postgres";
import { type AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { getUserIdFromEmail, getPurchasedCourses } from "@/lib/queries";

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


