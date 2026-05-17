import { ManageAccountForm } from "@/components/manage-account-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ManagePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-transparent bg-surface px-page py-4">
        <nav className="mx-auto flex h-10 w-full max-w-[1280px] items-center justify-between">
          <Link
            href="/"
            className="font-heading text-[33px] font-extrabold leading-none text-primary"
          >
            Torzo.
          </Link>
          <Button asChild className="h-[50px] px-6 font-heading">
            <Link href="/manage">Manage</Link>
          </Button>
        </nav>
      </header>

      <section className="w-full animate-page-fade-in px-page py-8 md:py-12">
        <ManageAccountForm />
      </section>
    </main>
  );
}
