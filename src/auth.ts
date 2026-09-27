import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface User {
    role?: "ADMIN" | "USER";
  }

  interface Session {
    user: {
      id: string;
      role?: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

if (!authSecret) {
  throw new Error("Missing Auth.js secret: set AUTH_SECRET and NEXTAUTH_SECRET to the same stable value in production.");
}

export const authConfig = {
  secret: authSecret,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        console.log("[AUTH DEBUG] authorize called", {
          hasEmail: Boolean(email),
          hasPassword: Boolean(password),
          email,
          env: process.env.NODE_ENV,
        });

        if (!email || !password) {
          console.log("[AUTH DEBUG] authorize missing email or password");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        console.log("[AUTH DEBUG] user lookup", {
          email,
          userFound: Boolean(user),
          role: user?.role ?? null,
        });

        if (!user || !user.passwordHash) {
          console.log("[AUTH DEBUG] authorize failed: user missing or passwordHash missing");
          return null;
        }

        const isValidPassword = await compare(password, user.passwordHash);

        console.log("[AUTH DEBUG] password validation", {
          email,
          role: user.role,
          passwordValid: isValidPassword,
        });

        if (!isValidPassword) {
          console.log("[AUTH DEBUG] authorize failed: invalid password");
          return null;
        }

        const result = {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role,
        };

        console.log("[AUTH DEBUG] authorize success", {
          id: result.id,
          email: result.email,
          role: result.role,
        });

        return result;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      const previousRole = token.role ?? null;

      if (user && user.role) {
        token.role = user.role as "ADMIN" | "USER";
      }

      if (!token.role) {
        token.role = "USER";
      }

      console.log("[AUTH DEBUG] jwt callback", {
        previousRole,
        incomingUserRole: user?.role ?? null,
        finalTokenRole: token.role,
      });

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      const finalRole = (token.role as "ADMIN" | "USER") ?? "USER";

      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = finalRole;
      }

      console.log("[AUTH DEBUG] session callback", {
        tokenRole: token.role ?? null,
        sessionRole: session.user?.role ?? null,
      });

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
