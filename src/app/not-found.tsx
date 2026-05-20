import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />
      <section className="flex min-h-[calc(100dvh-80px)] items-center justify-center px-4">
        <div className="text-center space-y-6">
          <h1 className="text-8xl font-bold text-foreground-strong">404</h1>
          <h2 className="text-2xl font-semibold text-foreground-strong">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block rounded-control bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground-strong"
          >
            Go Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}
