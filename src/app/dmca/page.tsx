import { SiteNavbar } from "@/components/site-navbar";

export default function DMCAPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />
      <section className="mx-auto max-w-3xl animate-page-fade-in px-4 py-12 md:px-10">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground-strong">
          DMCA Policy
        </h1>
        
        <div className="space-y-6 text-sm leading-relaxed text-text-subtle">
          <p>
            <strong className="text-foreground">Last updated:</strong> May 3, 2026
          </p>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">1. Notice & Takedown</h2>
            <p>
              Torzo respects the intellectual property rights of others and complies with the Digital 
              Millennium Copyright Act (DMCA). As a search engine that indexes metadata from third-party 
              sources, we do not host or store any copyrighted content on our servers.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">2. Filing a DMCA Notice</h2>
            <p>
              If you believe that content indexed by Torzo infringes your copyright, you may submit a 
              DMCA takedown notice. Your notice must include:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>A physical or electronic signature of the copyright owner or authorized representative</li>
              <li>Identification of the copyrighted work claimed to be infringed</li>
              <li>Identification of the material to be removed, including the specific URL or search query on Torzo</li>
              <li>Your contact information (address, telephone number, email)</li>
              <li>A statement of good faith belief that use of the material is not authorized</li>
              <li>A statement that the information is accurate and, under penalty of perjury, you are authorized to act</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">3. Counter-Notification</h2>
            <p>
              If you believe content was mistakenly removed, you may submit a counter-notification 
              including:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Your physical or electronic signature</li>
              <li>Identification of the content removed and its location before removal</li>
              <li>A statement under penalty of perjury that you have a good faith belief the content was removed in error</li>
              <li>Your name, address, telephone number, and a statement consenting to jurisdiction</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">4. Submission</h2>
            <p>
              DMCA notices should be sent to our designated agent at:
            </p>
            <div className="rounded-control bg-surface-subtle p-4 text-foreground-strong">
              <p>Email: dmca@torzo.vercel.app</p>
              <p>Subject Line: DMCA Takedown Request</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: Torzo indexes metadata only. For content hosted on third-party platforms, 
              you may also need to contact those platforms directly.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground-strong">5. Repeat Infringers</h2>
            <p>
              Torzo reserves the right to terminate access for users who are repeat infringers in 
              appropriate circumstances.
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            For more information about the DMCA, visit the{" "}
            <a 
              href="https://www.copyright.gov/dmca/" 
              target="_blank" 
              rel="noreferrer"
              className="text-link hover:underline"
            >
              U.S. Copyright Office website
            </a>.
          </p>
        </div>
      </section>
    </main>
  );
}
