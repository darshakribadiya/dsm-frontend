import { auth } from "@/lib/auth";
import { AuthProvider } from "./auth-provider";
import ClientSessionProvider from "./client/session-provider";

export default async function Provider({ children }) {
  const session = await auth();

  return (
    <ClientSessionProvider session={session}>
      <AuthProvider>{children}</AuthProvider>
    </ClientSessionProvider>
  );
}
