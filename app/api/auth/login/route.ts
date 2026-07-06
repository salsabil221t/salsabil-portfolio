import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  checkPassword,
  createSessionToken,
  isPasswordConfigured,
} from "@/lib/auth";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }

  if (!isPasswordConfigured()) {
    console.warn(
      "ADMIN_PASSWORD is not set — using the default dev password. Set ADMIN_PASSWORD before deploying."
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ ok: true });
}
