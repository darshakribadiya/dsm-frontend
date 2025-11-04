import { UserProvider } from "@/app/_context";
import { auth } from "@/lib/auth";
import { MeWithToken } from "@/lib/auth/utils";
import ClientSessionProvider from "./client/session-provider";

export default async function Provider({ children }) {
  const session = await auth();
  let user;
  if (session) {
    user = await MeWithToken(session.access_token);
  }

  return (
    <ClientSessionProvider session={session}>
      <UserProvider initUser={user}>{children}</UserProvider>
    </ClientSessionProvider>
  );
}
