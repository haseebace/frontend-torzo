import { ManageAccountForm } from "@/components/manage-account-form";
import { SiteNavbar } from "@/components/site-navbar";

export default function ManagePage() {
  return (
    <main className="min-h-dvh bg-white text-zinc-950">
      <SiteNavbar />

      <section className="w-full animate-page-fade-in px-4 py-8 md:px-10 xl:px-[150px]">
        <ManageAccountForm />
      </section>
    </main>
  );
}
