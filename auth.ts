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
      port: process.env.EMAIL_SERVER_PORT ? parseInt(process.env.EMAIL_SERVER_PORT) : undefined,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    },
    from: process.env.EMAIL_FROM,
    sendVerificationRequest: async ({ identifier, url, provider }) => {
      const { server, from } = provider;
      
      // Append email as a query parameter to the verify URL that Auth.js will use
      const verifyUrl = new URL(url);
      verifyUrl.searchParams.append('email', identifier);
      
      // Import nodemailer
      const nodemailer = await import("nodemailer");
      
      const transport = nodemailer.createTransport(server);
      
      // Current date for the email
      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      await transport.sendMail({
        to: identifier,
        from,
        subject: `Sign in to zackproser.com`,
        text: `Your magic link: ${verifyUrl.toString()}\n\nThis link will expire in 10 minutes.`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Magic Link</title>
  <!--[if mso]>
  <style>
    table {border-collapse: collapse;}
    td,th,div,p,a {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Courier New', monospace;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Email Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #4c1d95 0%, #4338ca 50%, #1e40af 100%); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px 30px 20px 30px;">
              <!-- Pixel Art Logo -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="width: 80px; height: 80px; background-color: #000; position: relative; margin: 0 auto; border: 4px solid #4c1d95; box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);">
                      <!-- Pixel Art Envelope - Created with table cells -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 80px; height: 80px; border-collapse: collapse;">
                        <tr>
                          <td width="20" height="20" style="background-color: #9333ea;"></td>
                          <td width="20" height="20" style="background-color: #9333ea;"></td>
                          <td width="20" height="20" style="background-color: #9333ea;"></td>
                          <td width="20" height="20" style="background-color: #9333ea;"></td>
                        </tr>
                        <tr>
                          <td width="20" height="20" style="background-color: #9333ea;"></td>
                          <td width="20" height="20" style="background-color: #8b5cf6;"></td>
                          <td width="20" height="20" style="background-color: #8b5cf6;"></td>
                          <td width="20" height="20" style="background-color: #9333ea;"></td>
                        </tr>
                        <tr>
                          <td width="20" height="20" style="background-color: #7c3aed;"></td>
                          <td width="20" height="20" style="background-color: #7c3aed;"></td>
                          <td width="20" height="20" style="background-color: #7c3aed;"></td>
                          <td width="20" height="20" style="background-color: #7c3aed;"></td>
                        </tr>
                        <tr>
                          <td width="20" height="20" style="background-color: #6d28d9;"></td>
                          <td width="20" height="20" style="background-color: #6d28d9;"></td>
                          <td width="20" height="20" style="background-color: #6d28d9;"></td>
                          <td width="20" height="20" style="background-color: #6d28d9;"></td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
              <h1 style="color: #ffffff; font-family: 'Courier New', monospace; margin: 20px 0 0 0; font-size: 24px; letter-spacing: -0.5px; text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);">MODERN CODING</h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 0 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(0, 0, 0, 0.4); border-radius: 8px; backdrop-filter: blur(10px); border: 2px solid #a855f7;">
                <tr>
                  <td style="padding: 30px; color: #ffffff;">
                    <h2 style="margin-top: 0; margin-bottom: 20px; font-family: 'Courier New', monospace; text-align: center; font-size: 20px; letter-spacing: -0.5px;">Your Magic Link</h2>
                    
                    <!-- Pixel Divider -->
                    <div style="height: 4px; width: 100%; background-image: repeating-linear-gradient(to right, transparent, transparent 4px, #a855f7 4px, #a855f7 8px); margin: 20px 0;"></div>
                    
                    <p style="margin-bottom: 20px; line-height: 1.5; font-family: 'Courier New', monospace;">Hello,</p>
                    
                    <p style="margin-bottom: 20px; line-height: 1.5; font-family: 'Courier New', monospace;">You requested a magic link to sign in to your Modern Coding account. Click the button below to complete the sign-in process.</p>
                    
                    <!-- Magic Link Button -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td align="center" style="border-radius: 4px; background-color: #9333ea; border: 3px solid #4c1d95; box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);" class="button-td">
                                <a href="${verifyUrl.toString()}" target="_blank" style="display: inline-block; padding: 16px 24px; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 4px; text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);" class="button-a">SIGN IN NOW</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin-top: 20px; margin-bottom: 10px; line-height: 1.5; font-family: 'Courier New', monospace;">This link will expire in 10 minutes and can only be used once.</p>
                    
                    <p style="margin-bottom: 20px; line-height: 1.5; font-family: 'Courier New', monospace;">If you didn't request this link, you can safely ignore this email.</p>
                    
                    <!-- Fallback Link -->
                    <p style="margin-top: 30px; font-size: 12px; color: #c4b5fd; font-family: 'Courier New', monospace;">If the button doesn't work, copy and paste this URL into your browser:</p>
                    <p style="margin-top: 5px; font-size: 12px; word-break: break-all; background-color: rgba(76, 29, 149, 0.5); padding: 10px; border-radius: 4px; color: #e9d5ff; font-family: 'Courier New', monospace;">${verifyUrl.toString()}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Pixel Art Footer -->
          <tr>
            <td align="center" style="padding: 20px 30px 30px 30px;">
              <!-- Pixel Art Nodes -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="20" height="20" style="background-color: #9333ea; border-radius: 4px; margin: 0 5px;"></td>
                  <td width="10"></td>
                  <td width="20" height="20" style="background-color: #6366f1; border-radius: 4px; margin: 0 5px;"></td>
                  <td width="10"></td>
                  <td width="20" height="20" style="background-color: #3b82f6; border-radius: 4px; margin: 0 5px;"></td>
                  <td width="10"></td>
                  <td width="20" height="20" style="background-color: #8b5cf6; border-radius: 4px; margin: 0 5px;"></td>
                </tr>
              </table>
              
              <p style="margin-top: 20px; color: #c4b5fd; font-size: 12px; font-family: 'Courier New', monospace;">© ${new Date().getFullYear()} Modern Coding. All rights reserved.</p>
              <p style="color: #c4b5fd; font-size: 12px; font-family: 'Courier New', monospace;">${date}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });
    }
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
    signIn: '/auth/login',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error'
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
