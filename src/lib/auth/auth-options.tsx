import { sql } from "@vercel/postgres";
import { type AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import { getUserIdFromEmail, getPurchasedCourses } from "@/lib/queries";
import PostgresAdapter from "@auth/pg-adapter"
import { createPool } from '@vercel/postgres';

declare module "next-auth" {
  interface Profile {
    login?: string;
  }
}

const pool = createPool();

export const authOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    })
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
          console.log('Checking if user already exists in database...')
          // Check if student record already exists
          let existingStudent;
          if (githubUsername) {
            existingStudent = await sql`
            SELECT * 
            FROM users 
            WHERE github_username = ${githubUsername}
          `;
          } else if (userEmailAddress) {
            existingStudent = await sql`
            SELECT *
            FROM users
            WHERE email = ${userEmailAddress}
          `;
          }

          console.log(`existingStudent: %o`, existingStudent);
          let userId;

          if (existingStudent && existingStudent.rowCount > 0) {
            // Student found, use id
            userId = existingStudent.rows[0].id;
            console.log(`Found existing student with id: ${userId}`);
          } else {
            // Create new student
            let createValues;
            if (githubUsername) {
              createValues = {
                github_username: githubUsername,
                name: userFullName
              };
            } else if (userEmailAddress) {
              createValues = {
                email: userEmailAddress
              };
            }

            console.log(`Creating new user with values: %o`, createValues);

            const createRes = await sql`
              INSERT INTO users (github_username, name, email)
              VALUES (${githubUsername}, ${userFullName}, ${userEmailAddress})
              RETURNING id
          `;
            userId = createRes.rows[0].id;
          }
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

      console.log(`userId: ${userId}`);

      // Add purchased courses to the session object
      session!.user!.purchased_courses = await getPurchasedCourses(Number(userId));

      console.log(`session before return: %o`, session);

      return {
        ...session,
      };
    }
  }

} as AuthOptions;
