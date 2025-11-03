import React from "react";
import { AuthProvider } from "./auth-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth/auth";

export default async function Provider({ children }) {
  const session = await auth();
  return (
    <>
      <SessionProvider session={session}>
        <AuthProvider>{children}</AuthProvider>
      </SessionProvider>
    </>
  );
}
