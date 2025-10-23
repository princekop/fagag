import Link from "next/link"

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: September 20, 2025</p>
        </div>

        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device when you visit Sjnodes. They help us provide you with a better experience by remembering your preferences and maintaining your login session.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              SJ Node Company uses cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Authentication:</strong> To keep you logged in across sessions</li>
              <li><strong>Security:</strong> To protect your account and prevent fraud</li>
              <li><strong>Preferences:</strong> To remember your settings and preferences</li>
              <li><strong>Performance:</strong> To analyze how you use our service and improve it</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Types of Cookies We Use</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <h3 className="font-semibold text-lg mb-2">Essential Cookies</h3>
                <p className="text-muted-foreground text-sm">
                  Required for the website to function properly. These include session cookies and authentication tokens.
                </p>
                <p className="text-xs text-muted-foreground mt-2">Duration: Session / 30 days</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <h3 className="font-semibold text-lg mb-2">Functional Cookies</h3>
                <p className="text-muted-foreground text-sm">
                  Remember your preferences like theme, language, and sidebar state.
                </p>
                <p className="text-xs text-muted-foreground mt-2">Duration: 1 year</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <h3 className="font-semibold text-lg mb-2">Analytics Cookies</h3>
                <p className="text-muted-foreground text-sm">
                  Help us understand how visitors interact with our website to improve user experience.
                </p>
                <p className="text-xs text-muted-foreground mt-2">Duration: 2 years</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Specific Cookies Used</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3">Cookie Name</th>
                    <th className="text-left py-2 px-3">Purpose</th>
                    <th className="text-left py-2 px-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3 font-mono text-xs">next-auth.session-token</td>
                    <td className="py-2 px-3">Authentication</td>
                    <td className="py-2 px-3">30 days</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3 font-mono text-xs">next-auth.csrf-token</td>
                    <td className="py-2 px-3">Security (CSRF protection)</td>
                    <td className="py-2 px-3">Session</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3 font-mono text-xs">theme</td>
                    <td className="py-2 px-3">Remember dark/light mode</td>
                    <td className="py-2 px-3">1 year</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3 font-mono text-xs">sidebar-state</td>
                    <td className="py-2 px-3">Remember sidebar preference</td>
                    <td className="py-2 px-3">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use third-party services that set their own cookies. These include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Pterodactyl Panel:</strong> For server management functionality</li>
              <li><strong>Analytics Services:</strong> To understand usage patterns (if enabled)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies</li>
              <li><strong>Browser Extensions:</strong> Use privacy extensions to manage cookies</li>
              <li><strong>Opt-Out:</strong> You can opt out of non-essential cookies through your account settings</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Note:</strong> Disabling essential cookies may affect the functionality of our service and prevent you from using certain features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Browser-Specific Instructions</h2>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
              <p><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</p>
              <p><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</p>
              <p><strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. The updated policy will be posted on this page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our use of cookies, please contact us through our support channels.
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
