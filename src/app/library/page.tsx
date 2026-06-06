import { LibraryView } from "@/components/library/library-view";
import { SiteNavbar } from "@/components/site-navbar";

export const metadata = {
  title: "Library",
  description: "Browse every file from your TorBox account in one place.",
};

export default function LibraryPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <section className="w-full animate-page-fade-in px-4 py-8 md:px-12 md:py-12">
        <LibraryView />
      </section>
    </main>
  );
}
