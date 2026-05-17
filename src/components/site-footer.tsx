import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-8 md:px-10 xl:px-[150px]">
      <div className="flex flex-col items-center gap-6 text-xs text-zinc-500 md:text-sm">
        <nav className="flex flex-wrap items-center justify-center gap-6">
          <Link 
            href="/disclaimer" 
            className="transition-colors hover:text-zinc-900"
          >
            Disclaimer
          </Link>
          <Link 
            href="/dmca" 
            className="transition-colors hover:text-zinc-900"
          >
            DMCA
          </Link>
          <Link 
            href="/privacy" 
            className="transition-colors hover:text-zinc-900"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/terms" 
            className="transition-colors hover:text-zinc-900"
          >
            Terms of Service
          </Link>
        </nav>
        
        <div className="text-center text-xs">
          <p>
            Torzo is a search engine. We do not host any content.
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} Torzo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
