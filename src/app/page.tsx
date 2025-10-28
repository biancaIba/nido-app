import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTokens } from "next-firebase-auth-edge";

import { clientConfig, serverConfig } from "../config";

export default async function Home() {
  const cookiesStore = await cookies();

  const tokens = await getTokens(cookiesStore, {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 sm:px-12 md:px-24">
      <h1 className="text-2xl mb-4 text-center sm:text-xl md:text-3xl">
        Bienvenido a Nido
      </h1>
    </main>
  );
}
