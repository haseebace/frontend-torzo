import { HomeBackground } from "@/components/home-background";
import { HomeContent } from "@/components/home-content";
import { SiteNavbar } from "@/components/site-navbar";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-x-hidden bg-white text-zinc-950">
      <HomeBackground />

      <SiteNavbar />
      <HomeContent />
    </main>
  );
}
