import React from "react";
import { AuthProvider } from "./auth-provider";

export default function Provider({ children }) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
