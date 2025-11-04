import { auth } from "@/lib/auth";
import { AuthProvider } from "./auth-provider";
import ClientSessionProvider from "./client/session-provider";
import { UserProvider } from "@/app/_context";

export default async function Provider({ children }) {
  const session = await auth();

  return (
    <ClientSessionProvider session={session}>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </ClientSessionProvider>
  );
}
