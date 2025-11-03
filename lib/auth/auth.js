import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CredentialsSignin } from "@auth/core/errors";
import { getUser, login } from "./methods";

export const { auth, handlers, signIn, signOut } = NextAuth({
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
          const tokens = await login(email, password);
          const user = await getUser(tokens.access_token);
          return {
            access_token: tokens.access_token,
            expires: tokens.expires,
            user: user,
          };
        } catch (err) {
          console.error(err);
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
});
