import { LandingPage } from "@/components/landing-page";
import { getContent } from "@/lib/content-store";

// Content is edited from the dashboard; always render the latest version.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  return <LandingPage content={content} />;
}
