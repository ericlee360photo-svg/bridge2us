import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  // Comment out adapter for now to use JWT sessions
  // adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Simple sign in - just allow all Google users for now
      return true;
    },
    async session({ session, token }) {
      // Pass token data to session
      if (session.user && token) {
        session.user.id = token.sub || '';
        session.user.firstName = token.given_name as string || token.name?.split(' ')[0] || '';
        session.user.lastName = token.family_name as string || token.name?.split(' ').slice(1).join(' ') || '';
        session.user.googleId = token.sub || '';
        session.user.avatar = token.picture as string || '';
        session.user.timezone = 'UTC';
        session.user.country = '';
        session.user.language = 'en';
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // Store user data in JWT token
      if (profile) {
        token.given_name = profile.given_name;
        token.family_name = profile.family_name;
        token.picture = profile.picture;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/signup',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
