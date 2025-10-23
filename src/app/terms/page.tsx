import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: September 20, 2025</p>
        </div>

        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Sjnodes ("the Service"), provided by SJ Node Company, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Service Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sjnodes provides free game server hosting services. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You must be at least 13 years old to use this service</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree not to use the service for any illegal or unauthorized purpose</li>
              <li>You will not host malicious content, malware, or engage in DDoS attacks</li>
              <li>You will not abuse, harass, or harm other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Account Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms. All provisions of the Terms shall survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Server Usage Policy</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Servers must comply with applicable laws and regulations</li>
              <li>Resource abuse or excessive usage may result in suspension</li>
              <li>We reserve the right to limit resources based on fair usage</li>
              <li>Servers inactive for extended periods may be deleted</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sjnodes and SJ Node Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. We provide the service "as is" without any warranties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Data and Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your use of the Service is also governed by our Privacy Policy. We collect and process data as described in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms, please contact us through our support channels.
            </p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="font-semibold">SJ Node Company</p>
              <p className="text-sm text-muted-foreground">Founded: September 20, 2025</p>
              <p className="text-sm text-muted-foreground">Owner: Shresth</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
