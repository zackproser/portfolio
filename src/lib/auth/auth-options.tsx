import { sql } from "@vercel/postgres";
import { type AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import { getUserIdFromEmail, getPurchasedCourses } from "@/lib/queries";
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from 'pg'

declare module "next-auth" {
  interface Profile {
    login?: string;
  }
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false
  }
})

export const authOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account) {
        console.log(`signIn callback: %o, %o, %o, %o, %o`, user, account, profile, email, credentials);

        let githubUsername, userFullName, userEmailAddress;

        if (account.provider === 'github') {
          // Extract GitHub profile info
          githubUsername = profile!.login!;
          userFullName = profile!.name!;
        } else if (account.provider === 'email') {
          // Get email profile info
          userEmailAddress = user!.email!;
        }

        console.log(`signIn callback githubUsername: ${githubUsername}, userFullName: ${userFullName}, userEmailAddress: ${userEmailAddress}`);

        try {
          // Check if student record already exists
          let existingStudent;
          if (githubUsername) {
            existingStudent = await sql`
            SELECT * 
            FROM students 
            WHERE github_username = ${githubUsername}
          `;
          } else if (userEmailAddress) {
            existingStudent = await sql`
            SELECT *
            FROM students
            WHERE email = ${userEmailAddress}
          `;
          }

          let studentId;

          if (existingStudent && existingStudent.rowCount > 0) {
            // Student found, use id
            studentId = existingStudent.rows[0].student_id;
          } else {
            // Create new student
            let createValues;
            if (githubUsername) {
              createValues = {
                github_username: githubUsername,
                full_name: userFullName
              };
            } else if (userEmailAddress) {
              createValues = {
                email: userEmailAddress
              };
            }

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
      }
    },

    async session({ session, user, token }) {
      console.log(`session method callback: %o, %o, %o`, session, user, token);

      console.log(`session.user.email: ${session!.user!.email}`);

      const userId = await getUserIdFromEmail(session!.user!.email!);

      // Add purchased courses to the session object
      session!.user!.purchased_courses = await getPurchasedCourses(Number(userId));

      console.log(`session before return: %o`, session);

      return {
        ...session,
      };
    }
  }

} as AuthOptions;