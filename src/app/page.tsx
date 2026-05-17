import { HomeContent } from "@/components/home-content";
import { SiteNavbar } from "@/components/site-navbar";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col overflow-x-hidden bg-surface text-foreground">
      <SiteNavbar />
      <HomeContent />
    </main>
  );
}
