import { Buffer } from "node:buffer";
import { cookies, headers } from "next/headers";

/**
 * Cookie « Secure » uniquement si la requête est en HTTPS (ou forcé par env).
 * Sinon, en Docker sur http://localhost:3000 avec NODE_ENV=production, le
 * navigateur ignore Set-Cookie et le nom connecté ne s’affiche jamais.
 */
async function cookieShouldBeSecure(): Promise<boolean> {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  const h = await headers();
  const forwarded = h.get("x-forwarded-proto");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim().toLowerCase() === "https";
  }
  return false;
}

export const DISPLAY_SESSION_COOKIE = "sondage_display";

export type DisplaySession = {
  name: string;
  email: string;
};

function normalizeSession(o: unknown): DisplaySession | null {
  if (
    o &&
    typeof o === "object" &&
    "name" in o &&
    "email" in o &&
    typeof (o as DisplaySession).name === "string" &&
    typeof (o as DisplaySession).email === "string"
  ) {
    const name = (o as DisplaySession).name.trim();
    const email = (o as DisplaySession).email.trim();
    if (!name || !email) return null;
    return { name, email };
  }
  return null;
}

/** Valeur cookie sûre pour Set-Cookie (évite caractères sensibles du JSON brut). */
function encodeSessionPayload(session: DisplaySession): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decodeSessionPayload(raw: string): DisplaySession | null {
  try {
    const fromJson = normalizeSession(JSON.parse(raw) as unknown);
    if (fromJson) return fromJson;
  } catch {
    /* ancien ou invalide */
  }
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    return normalizeSession(JSON.parse(json) as unknown);
  } catch {
    return null;
  }
}

export async function getDisplaySession(): Promise<DisplaySession | null> {
  const jar = await cookies();
  const raw = jar.get(DISPLAY_SESSION_COOKIE)?.value;
  if (!raw) return null;
  return decodeSessionPayload(raw);
}

export async function clearDisplaySessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(DISPLAY_SESSION_COOKIE);
}

export async function setDisplaySessionCookie(name: string, email: string): Promise<void> {
  const jar = await cookies();
  const payload = encodeSessionPayload({
    name: name.trim(),
    email: email.trim(),
  });
  jar.set(DISPLAY_SESSION_COOKIE, payload, {
    httpOnly: true,
    secure: await cookieShouldBeSecure(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
