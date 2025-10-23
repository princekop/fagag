import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="fixed inset-0 bg-background overflow-y-auto">
      <div className="container max-w-4xl mx-auto px-4 py-12 pb-20">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: September 20, 2025</p>
        </div>

        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              SJ Node Company ("we", "us", "our") collects information to provide better services to our users. We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Account Information:</strong> Email address, username, and password (encrypted)</li>
              <li><strong>Server Information:</strong> Server names, configurations, and usage data</li>
              <li><strong>Usage Data:</strong> IP address, browser type, access times, and pages viewed</li>
              <li><strong>Cookies:</strong> We use cookies to maintain your session and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>To provide, maintain, and improve our services</li>
              <li>To manage your account and provide customer support</li>
              <li>To monitor usage and prevent abuse</li>
              <li>To send important service notifications</li>
              <li>To personalize your experience on our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Data Storage and Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Passwords are encrypted using bcrypt hashing</li>
              <li>Sensitive data is encrypted in transit using HTTPS</li>
              <li>Database access is restricted and monitored</li>
              <li>Regular security audits and updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist in operations (under strict confidentiality)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to maintain sessions, remember preferences, and analyze usage. You can control cookies through your browser settings. See our Cookie Policy for more details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service integrates with Pterodactyl Panel for server management. Please review their privacy policy for information on how they handle data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal data only as long as necessary to provide services and fulfill the purposes outlined in this policy. Inactive accounts may be deleted after a period of inactivity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Changes to Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us through our support channels.
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
