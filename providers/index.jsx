import { AuthProvider } from "./auth-provider";
import ClientSessionProvider from "./client/session-provider";

export default async function Provider({ children }) {
  return (
    <ClientSessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </ClientSessionProvider>
  );
}
