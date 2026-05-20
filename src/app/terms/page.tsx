import Link from "next/link";
import { SiteNavbar } from "@/components/site-navbar";

export default function TermsPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />
      <section className="mx-auto max-w-3xl animate-page-fade-in px-4 py-12 md:px-10">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground-strong">
          Terms of Service
        </h1>
        
        <div className="space-y-6 text-sm leading-relaxed text-text-subtle">
          <p>
            <strong className="text-foreground">Last updated:</strong> May 3, 2026
          </p>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Torzo, you agree to be bound by these Terms of Service. 
              If you do not agree, do not use our service.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">2. Description of Service</h2>
            <p>
              Torzo is a search engine that indexes and provides access to publicly available 
              metadata from third-party sources. We do not host, store, or distribute any content. 
              Our service helps users discover movies, TV shows, and other digital content.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Use Torzo in compliance with all applicable laws and regulations</li>
              <li>Respect intellectual property rights</li>
              <li>Not use Torzo for any unlawful purpose</li>
              <li>Ensure you have proper authorization for any content you access</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">4. Third-Party Services</h2>
            <p>
              Torzo integrates with third-party services including Real-Debrid, TMDB, and various 
              content providers. Your use of these services is subject to their respective terms 
              and policies. Torzo is not responsible for the content, accuracy, or legality of 
              third-party services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">5. Intellectual Property</h2>
            <p>
              Torzo and its original content, features, and functionality are owned by us and 
              protected by international copyright, trademark, and other intellectual property laws. 
              We do not claim ownership of content indexed from third-party sources.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">6. Disclaimer of Warranties</h2>
            <p>
              Torzo is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We 
              do not guarantee that our service will be uninterrupted, error-free, or secure. 
              Search results and metadata are provided by third parties and may be inaccurate.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Torzo shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising from your use of our 
              service.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">8. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Torzo from any claims, damages, or 
              expenses arising from your use of our service or violation of these terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">9. Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to our service at any time, 
              without notice, for conduct that we believe violates these Terms or is harmful to 
              other users.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">10. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Continued use of Torzo after changes 
              constitutes acceptance of the new terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">11. Contact</h2>
            <p>
              For questions about these Terms, contact us at legal@torzo.app.
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Also see our{" "}
            <Link href="/privacy" className="text-link hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/disclaimer" className="text-link hover:underline">
              Disclaimer
            </Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
