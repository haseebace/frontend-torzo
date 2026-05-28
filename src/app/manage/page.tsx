import { ManageAccountForm } from "@/components/manage-account-form";
import { SiteNavbar } from "@/components/site-navbar";

export default function ManagePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <section className="w-full animate-page-fade-in px-4 py-8 md:px-12 md:py-12">
        <ManageAccountForm />
      </section>
    </main>
  );
}
