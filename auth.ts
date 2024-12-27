import { sql } from "@vercel/postgres";
import { getUserIdFromEmail, getPurchasedCourses } from "@/lib/queries";
import NextAuth, { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import type { Provider } from 'next-auth/providers'
import EmailProvider from 'next-auth/providers/email'
import PostgresAdapter from "@auth/pg-adapter"
import { createPool } from '@vercel/postgres';

declare module "next-auth" {
  interface Profile {
    login?: string;
    avatar_url?: string;
  }
  
  interface User {
    provider?: string;
    image?: string | null;
  }

  interface Session {
    user: {
      id?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
      purchased_courses?: number[];
    }
  }
}

const pool = createPool();

const providers: Provider[] = [
  GitHub({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET
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
]

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  pages: {
    signIn: '/login'
  },
  providers,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account) {
        console.log(`signIn callback: %o, %o, %o, %o, %o`, user, account, profile, email, credentials);

        let githubUsername, userFullName, userEmailAddress, avatarUrl;

        if (account.provider === 'github') {
          // Extract GitHub profile info
          githubUsername = profile!.login!;
          userFullName = profile!.name!;
          avatarUrl = profile!.avatar_url;
          
          // Update the user object with GitHub info
          try {
            await sql`
              UPDATE users 
              SET 
                name = ${userFullName},
                image = ${avatarUrl},
                github_username = ${githubUsername}
              WHERE email = ${user.email}
            `;
          } catch (error) {
            console.error('Error updating user with GitHub info:', error);
          }
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
                name: userFullName,
                image: avatarUrl
              };
            } else if (userEmailAddress) {
              createValues = {
                email: userEmailAddress
              };
            }

            console.log(`Creating new user with values: %o`, createValues);

            const createRes = await sql`
              INSERT INTO users (github_username, name, email, image)
              VALUES (${githubUsername}, ${userFullName}, ${userEmailAddress}, ${avatarUrl})
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

      // Get the full user record from the database
      const { rows } = await sql`
        SELECT * FROM users WHERE id = ${userId}
      `;
      const dbUser = rows[0];

      // Add purchased courses to the session object
      session!.user!.purchased_courses = await getPurchasedCourses(Number(userId));
      
      // Add provider and image from the database user
      session!.user!.provider = dbUser.github_username ? 'GitHub' : 'Email';
      session!.user!.image = dbUser.image;

      console.log(`session before return: %o`, session);

      return {
        ...session,
      };
    }
  }
} as NextAuthConfig)
