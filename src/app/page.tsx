import { HomeContent } from "@/components/home-content";
import { SiteNavbar } from "@/components/site-navbar";
import { TmdbSuggestionsPrefetch } from "@/components/tmdb-suggestions-prefetch";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col overflow-x-hidden bg-bg-canvas text-text-primary">
      <SiteNavbar />
      <TmdbSuggestionsPrefetch />
      <HomeContent />
    </main>
  );
}
