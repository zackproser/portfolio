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

      // Insert login record into 'logins' table
      try {
        await sql`
          INSERT INTO logins (github_username) VALUES (${githubUsername})
        `;
      } catch (error) {
        console.error('Error inserting login record:', error);
      }

      return true;
    }
  }
} as AuthOptions;

