import { NextAuth, DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** Array of IDs for courses the current user has purchased */
      purchased_courses: number[]
    } & DefaultSession["user"]
  }
}
