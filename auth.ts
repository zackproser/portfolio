import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import NextAuth, { NextAuthConfig } from 'next-auth'
import type { Provider } from 'next-auth/providers'
import EmailProvider from 'next-auth/providers/email'

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
      name?: string | null;
      image?: string | null;
      provider?: string;
    }
  }
}

const providers: Provider[] = [
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
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login'
  },
  providers,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Simply return true to allow sign in
      return true;
    },
    async session({ session, user, token }) {
      if (session.user && user) {
        session.user.id = user.id;
        
        // Add provider info - always set to Email now
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { accounts: true }
        });
        
        if (dbUser) {
          session.user.provider = 'Email';
          session.user.image = dbUser.image;
        }
      }
      
      return session;
    }
  }
} as NextAuthConfig)
