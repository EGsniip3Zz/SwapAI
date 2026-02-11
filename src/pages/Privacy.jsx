import { Link } from 'react-router-dom'
import { Zap, Shield } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
            <Shield className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-300">Legal</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: February 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <div className="space-y-8 text-slate-300">

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>
                SwapAI ("we," "us," or "our") respects your privacy and is committed to protecting your
                personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you use our marketplace platform. Please read this policy carefully.
                By using SwapAI, you consent to the practices described in this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Account Information:</strong> Name, email address, password, and profile details</li>
                <li><strong className="text-white">Payment Information:</strong> Payment details processed securely through Stripe (we do not store full payment card numbers)</li>
                <li><strong className="text-white">Seller Information:</strong> Business details, payout information, product listings</li>
                <li><strong className="text-white">Communications:</strong> Messages between users, support requests, feedback</li>
                <li><strong className="text-white">User Content:</strong> Product descriptions, images, and other content you submit</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">2.2 Information Collected Automatically</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong className="text-white">Usage Data:</strong> Pages visited, features used, time spent on the platform</li>
                <li><strong className="text-white">Cookies:</strong> Session cookies, preference cookies, and analytics cookies</li>
                <li><strong className="text-white">Log Data:</strong> Access times, error logs, and referring URLs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Create and manage your account</li>
                <li>Facilitate communication between users</li>
                <li>Send administrative notifications and updates</li>
                <li>Respond to your comments, questions, and support requests</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Detect, prevent, and address fraud and security issues</li>
                <li>Enforce our Terms of Service</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing & Disclosure</h2>
              <p className="mb-3">We may share your information in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">With Other Users:</strong> Buyers can see Seller profiles; Sellers can see Buyer information necessary to complete transactions</li>
                <li><strong className="text-white">Service Providers:</strong> Third-party vendors who assist in operating our platform (payment processors, hosting providers, analytics)</li>
                <li><strong className="text-white">Legal Requirements:</strong> When required by law, subpoena, or legal process</li>
                <li><strong className="text-white">Protection of Rights:</strong> To protect SwapAI's rights, property, or safety, or that of our users</li>
                <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong className="text-white">With Consent:</strong> When you have given us explicit permission</li>
              </ul>
              <p className="mt-4">
                <strong className="text-white">We do not sell your personal information to third parties.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services</h2>
              <p className="mb-4">
                Our platform uses third-party services that may collect information about you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Stripe:</strong> For payment processing. See Stripe's Privacy Policy.</li>
                <li><strong className="text-white">Supabase:</strong> For database and authentication services.</li>
                <li><strong className="text-white">Vercel:</strong> For hosting services.</li>
              </ul>
              <p className="mt-4">
                These services have their own privacy policies, and we encourage you to review them.
                We are not responsible for the privacy practices of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Security</h2>
              <p>
                We implement reasonable security measures to protect your personal information, including
                encryption, secure servers, and access controls. However, no method of transmission over
                the Internet or electronic storage is 100% secure. While we strive to use commercially
                acceptable means to protect your information, we cannot guarantee absolute security.
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed
                to provide you services. We may also retain and use your information to comply with legal
                obligations, resolve disputes, and enforce our agreements. When you delete your account,
                we will delete or anonymize your personal information within 90 days, except where we are
                required to retain it for legal purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights & Choices</h2>
              <p className="mb-3">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
                <li><strong className="text-white">Correction:</strong> Request correction of inaccurate data</li>
                <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data</li>
                <li><strong className="text-white">Portability:</strong> Request transfer of your data to another service</li>
                <li><strong className="text-white">Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong className="text-white">Cookies:</strong> Manage cookie preferences through your browser settings</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us through our Support page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Cookies</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to collect and track information and
                to improve our services. You can instruct your browser to refuse all cookies or to
                indicate when a cookie is being sent. However, if you do not accept cookies, you may
                not be able to use some portions of our platform.
              </p>
              <p className="mb-3">Types of cookies we use:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Essential Cookies:</strong> Necessary for the platform to function</li>
                <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
                <li><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Children's Privacy</h2>
              <p>
                SwapAI is not intended for users under 18 years of age. We do not knowingly collect
                personal information from children under 18. If we learn that we have collected personal
                information from a child under 18, we will delete that information promptly. If you
                believe we may have collected information from a child under 18, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. International Data Transfers</h2>
              <p>
                Your information may be transferred to and maintained on servers located outside your
                country of residence, where data protection laws may differ. By using our platform,
                you consent to the transfer of your information to the United States and other
                countries where we operate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. California Privacy Rights (CCPA)</h2>
              <p>
                If you are a California resident, you have specific rights under the California Consumer
                Privacy Act (CCPA), including the right to know what personal information we collect,
                request deletion of your data, and opt-out of the sale of your personal information.
                As noted above, we do not sell personal information. To exercise your CCPA rights,
                please contact us through our Support page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
                You are advised to review this Privacy Policy periodically for any changes. Changes
                are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through our
                <Link to="/support" className="text-violet-400 hover:text-violet-300 ml-1">Support page</Link>.
              </p>
            </section>

          </div>
        </div>

        {/* Links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-4">
          <Link to="/terms" className="text-violet-400 hover:text-violet-300 transition-colors">
            Terms of Service →
          </Link>
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
