import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content-store";
import type { SiteContent } from "@/lib/content";

export async function GET() {
  const content = await getContent();
  return Response.json(content);
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  if (!verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SiteContent;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !body.hero || !body.siteName) {
    return Response.json({ error: "Invalid content shape" }, { status: 400 });
  }

  await saveContent(body);
  return Response.json({ ok: true });
}
