import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh bg-surface text-foreground">
      <SiteNavbar />
      <section className="mx-auto max-w-3xl animate-page-fade-in px-4 py-12 md:px-10">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-sm leading-relaxed text-text-subtle">
          <p>
            <strong className="text-foreground">Last updated:</strong> May 3, 2026
          </p>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p>
              Torzo is designed with privacy in mind. We collect minimal information:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Usage Data:</strong> We use Vercel Analytics to collect anonymized 
                usage statistics (page views, referrers) to improve our service.
              </li>
              <li>
                <strong>Cookies:</strong> We store your provider preferences locally in your 
                browser (not on our servers).
              </li>
              <li>
                <strong>Search Queries:</strong> Searches are processed through our API but 
                are not permanently stored or linked to your identity.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">2. How We Use Information</h2>
            <p>Information is used solely to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Provide and improve our search services</li>
              <li>Remember your preferences (provider selection)</li>
              <li>Analyze usage patterns to enhance user experience</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">3. Third-Party Services</h2>
            <p>Torzo integrates with:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Real-Debrid:</strong> If you connect your Real-Debrid account, 
                authentication is handled directly between you and Real-Debrid. We do not 
                store your credentials.
              </li>
              <li>
                <strong>TMDB:</strong> We use The Movie Database API to fetch movie and 
                TV show metadata.
              </li>
              <li>
                <strong>Vercel:</strong> Our hosting provider may collect standard server 
                logs (IP addresses, user agents) for security and performance.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">4. Data Storage</h2>
            <p>
              Torzo does not maintain a user database. We do not collect names, emails, 
              or personal identifiers. All preferences are stored locally in your browser.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">5. Cookies</h2>
            <p>We use minimal cookies:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Provider selection preferences (localStorage)</li>
              <li>Analytics cookies (if consented)</li>
            </ul>
            <p className="text-xs text-muted-foreground">
              You can disable cookies in your browser settings without affecting core functionality.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">6. Your Rights</h2>
            <p>
              Since we collect minimal data, there is little to access or delete. If you have 
              concerns about your privacy, contact us at privacy@torzo.app.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">7. Changes</h2>
            <p>
              We may update this policy occasionally. Continued use of Torzo after changes 
              constitutes acceptance of the updated policy.
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            For questions, contact us at privacy@torzo.app or visit our{" "}
            <Link href="/disclaimer" className="text-link hover:underline">
              Disclaimer
            </Link>{" "}
            page.
          </p>
        </div>
      </section>
    </main>
  );
}
