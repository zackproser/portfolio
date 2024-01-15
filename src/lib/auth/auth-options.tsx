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

      // Insert login record into 'logins' table
      try {
        await sql`
          INSERT INTO logins (github_username) VALUES (${githubUsername})
        `;
      } catch (error) {
        console.error('Error inserting login record:', error);
      }

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

      return true;
    },
    async session({ session, user, token }) {
      console.log(`session method callback: %o, %o, %o`, session, user, token)
      return {
        wakka: true,
        ...session,
      }
    }
  }
} as AuthOptions;

