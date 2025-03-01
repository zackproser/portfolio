import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { associatePurchasesToUser } from "@/lib/purchases";
import NextAuth, { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
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
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login'
  },
  providers,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account) {
        console.log(`signIn callback: %o, %o, %o, %o, %o`, user, account, profile, email, credentials);

        if (account.provider === 'github') {
          // Extract GitHub profile info
          const githubUsername = profile!.login!;
          const userFullName = profile!.name!;
          const avatarUrl = profile!.avatar_url;
          
          // Update the user object with GitHub info
          try {
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                name: userFullName,
                image: avatarUrl,
                githubUsername: githubUsername
              }
            });
          } catch (error) {
            console.error('Error updating user with GitHub info:', error);
          }
        }

        // If the user has an email, associate any purchases made with this email
        if (user.email && user.id) {
          try {
            const count = await associatePurchasesToUser(user.email, user.id);
            if (count > 0) {
              console.log(`Associated ${count} purchases to user ${user.id}`);
            }
          } catch (error) {
            console.error('Error associating purchases:', error);
          }
        }

        return true;
      }
      return true;
    },
    async session({ session, user, token }) {
      if (session.user && user) {
        session.user.id = user.id;
        
        // Add provider info
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { accounts: true }
        });
        
        if (dbUser) {
          session.user.provider = dbUser.githubUsername ? 'GitHub' : 'Email';
          session.user.image = dbUser.image;
        }
      }
      
      return session;
    }
  }
} as NextAuthConfig)
