import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-white text-zinc-950">
      <SiteNavbar />
      <section className="flex min-h-[calc(100dvh-80px)] items-center justify-center px-4">
        <div className="text-center space-y-6">
          <h1 className="text-8xl font-bold text-zinc-950">404</h1>
          <h2 className="text-2xl font-semibold text-zinc-700">Page Not Found</h2>
          <p className="text-zinc-500 max-w-md">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link 
            href="/" 
            className="inline-block rounded-lg bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Go Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}
