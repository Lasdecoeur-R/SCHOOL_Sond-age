"use server";

import { redirect } from "next/navigation";
import { clearDisplaySessionCookie, setDisplaySessionCookie } from "@/lib/display-session";

export type LoginActionState = {
  ok: boolean | null;
  message: string | null;
};

/**
 * Connexion sans e-mail pour l’instant : validation puis redirection.
 * (Better Auth + lien magique à brancher plus tard.)
 */
export async function submitMagicLinkRequest(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!name || !email) {
    return { ok: false, message: "Nom et e-mail requis." };
  }
  await setDisplaySessionCookie(name, email);
  redirect("/tableau-de-bord");
}

export async function logoutDisplaySession(): Promise<void> {
  await clearDisplaySessionCookie();
  redirect("/connexion");
}
