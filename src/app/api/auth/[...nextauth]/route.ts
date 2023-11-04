import NextAuth, { type AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

// export this because react server components also need it in order to call 
// getServerSession
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
      return true
    }
  }
} as AuthOptions

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
