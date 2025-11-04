import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth/next";
import { MeWithToken } from "./utils";
import api from "@/lib/api";

const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async ({ email, password }) => {
        try {
          const sanctumUrl = process.env.NEXT_PUBLIC_API_SANCTUM_URL;
          if (sanctumUrl) {
            try {
              await api.get(`${sanctumUrl}/sanctum/csrf-cookie`);
            } catch (csrfErr) {
              console.warn("CSRF cookie fetch failed:", csrfErr?.message);
            }
          }
          const res = await api.post("/login", { email, password });
          const token = res.data?.token;

          if (!token) {
            console.error(
              "No token received from login. Response:",
              JSON.stringify(res.data, null, 2)
            );
            return null;
          }
          const user = await MeWithToken(token);
          if (!user) {
            console.error("Failed to fetch user data");
            return null;
          }
          return {
            access_token: token,
            expires: 86400000, // 24 hours in ms
            user: user,
          };
        } catch (err) {
          console.error("Login error:", {
            message: err?.message,
            status: err?.response?.status,
            statusText: err?.response?.statusText,
            data: err?.response?.data,
            stack: err?.stack,
          });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger == "signIn") {
        // Data from authorize callback
        token.access_token = user.access_token;
        token.expires_at = new Date().getTime() + user.expires;
        token.user = user.user;
      } else if (trigger == "update") {
        token.user = {
          ...token.user,
          ...session.user,
        };
      }

      if (token.expires_at <= new Date().getTime()) {
        return null;
      } else {
        return token;
      }
    },

    session: async ({ session, token }) => {
      if (!token) return null;

      session.user = token.user;
      session.access_token = token.access_token;

      return session;
    },
  },
};

export const handlers = NextAuth(authOptions);

export async function auth() {
  return await getServerSession(authOptions);
}
