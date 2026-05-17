import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background px-4 py-9 md:px-10 xl:px-page">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs font-medium leading-6 text-muted-foreground md:text-sm">
        <span>© {new Date().getFullYear()} Torzo. All rights reserved.</span>
        <span aria-hidden="true">·</span>
        <nav className="contents">
          <Link 
            href="/disclaimer" 
            className="transition-colors hover:text-foreground"
          >
            Disclaimer
          </Link>
          <span aria-hidden="true">·</span>
          <Link 
            href="/dmca" 
            className="transition-colors hover:text-foreground"
          >
            DMCA
          </Link>
          <span aria-hidden="true">·</span>
          <Link 
            href="/privacy" 
            className="transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <span aria-hidden="true">·</span>
          <Link 
            href="/terms" 
            className="transition-colors hover:text-foreground"
          >
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
