import { cookies } from "next/headers";
import { Dashboard } from "@/components/admin/dashboard";
import { LoginForm } from "@/components/admin/login-form";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { getContent } from "@/lib/content-store";

export const metadata = {
  title: "لوحة التحكم · Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authenticated = verifySessionToken(
    cookieStore.get(SESSION_COOKIE)?.value
  );

  if (!authenticated) {
    return <LoginForm />;
  }

  const content = await getContent();
  return <Dashboard initialContent={content} />;
}
