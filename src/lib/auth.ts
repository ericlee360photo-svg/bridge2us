import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
      if (account?.provider === "google" && profile) {
        // Check if user exists, if not create them
        let dbUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!dbUser) {
          // Create new user with Google profile information
          dbUser = await prisma.user.create({
            data: {
              email: profile.email,
              firstName: profile.given_name || user.name?.split(' ')[0] || '',
              lastName: profile.family_name || user.name?.split(' ').slice(1).join(' ') || '',
              avatar: profile.picture,
              googleId: profile.sub,
              timezone: "UTC", // Default timezone
              emailVerified: true, // Google accounts are pre-verified
            },
          });
        } else {
          // Update existing user with Google profile information
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              googleId: profile.sub,
              firstName: profile.given_name || user.name?.split(' ')[0] || dbUser.firstName,
              lastName: profile.family_name || user.name?.split(' ').slice(1).join(' ') || dbUser.lastName,
              avatar: profile.picture,
              emailVerified: true,
            },
          });
        }

        // Update the user object with database user data
        user.id = dbUser.id;
        user.firstName = dbUser.firstName;
        user.lastName = dbUser.lastName;
        user.avatar = dbUser.avatar;
        user.googleId = dbUser.googleId;
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.firstName = user.firstName;
        session.user.lastName = user.lastName;
        session.user.googleId = user.googleId;
        session.user.avatar = user.avatar;
        session.user.timezone = user.timezone;
        session.user.country = user.country;
        session.user.language = user.language;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.googleId = user.googleId;
        token.avatar = user.avatar;
        token.timezone = user.timezone;
        token.country = user.country;
        token.language = user.language;
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
