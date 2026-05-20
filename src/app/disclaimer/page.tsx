import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";

export default function DisclaimerPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />
      <section className="mx-auto max-w-3xl animate-page-fade-in px-4 py-12 md:px-10">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground-strong">
          Disclaimer
        </h1>
        
        <div className="space-y-6 text-sm leading-relaxed text-text-subtle">
          <p>
            <strong className="text-foreground">Last updated:</strong> May 3, 2026
          </p>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">1. Nature of Service</h2>
            <p>
              Torzo is a search engine and indexing service that helps users discover publicly available 
              content across the internet. We do not host, store, or distribute any files, media, or content 
              on our servers. All content is sourced from third-party providers and platforms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">2. No Hosting</h2>
            <p>
              Torzo does not host any copyrighted material. We provide search functionality and links to 
              external sources only. Any content accessed through our platform is the sole responsibility 
              of the third-party providers that host such content.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">3. Search Results</h2>
            <p>
              Search results displayed on Torzo are automatically generated from third-party APIs and 
              indexed sources. We do not manually curate, select, or endorse any specific content in our 
              search results. The availability, accuracy, and legality of such content is the responsibility 
              of the respective content providers.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">4. Legal Compliance</h2>
            <p>
              Users are solely responsible for ensuring their use of Torzo complies with all applicable 
              local, state, national, and international laws and regulations. Torzo does not encourage, 
              promote, or facilitate copyright infringement or illegal downloading.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">5. Third-Party Services</h2>
            <p>
              Torzo integrates with third-party services including Real-Debrid for enhanced download 
              capabilities. Use of such services is subject to their respective terms of service and 
              privacy policies. Torzo is not affiliated with, endorsed by, or responsible for these 
              third-party services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">6. Contact</h2>
            <p>
              For any questions regarding this disclaimer, please contact us through our official 
              channels. For copyright-related concerns, please refer to our{" "}
              <Link href="/dmca" className="text-link hover:underline">
                DMCA Policy
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
