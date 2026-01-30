import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-300">Legal</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <div className="space-y-8 text-slate-300">

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using SwapAI ("the Platform"), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use the Platform. SwapAI reserves the right
                to modify these terms at any time, and your continued use constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                SwapAI is an online marketplace that connects AI tool builders ("Sellers") with individuals
                and businesses seeking AI solutions ("Buyers"). We facilitate transactions between Sellers
                and Buyers but are not a party to any transaction between users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              <p className="mb-3">To use certain features of the Platform, you must create an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Seller Terms</h2>
              <p className="mb-3">If you list products on SwapAI as a Seller, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Only list AI tools and products you have the right to sell</li>
                <li>Provide accurate descriptions and documentation</li>
                <li>Deliver purchased products as described</li>
                <li>Respond to buyer inquiries in a timely manner</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              <p className="mt-4">
                <strong className="text-white">Platform Fee:</strong> SwapAI charges a 10% platform fee on all
                transactions. Sellers receive 90% of the sale price, minus payment processing fees (approximately 2.9% + $0.30 per transaction).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Buyer Terms</h2>
              <p className="mb-3">If you purchase products on SwapAI as a Buyer, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate payment information</li>
                <li>Use purchased products in accordance with their licenses</li>
                <li>Not resell or redistribute products without authorization</li>
                <li>Report any issues with products through our support system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Payments and Refunds</h2>
              <p className="mb-3">
                All payments are processed through Stripe. By making a purchase, you authorize SwapAI to
                charge your payment method for the total amount of your order.
              </p>
              <p>
                Refund policies are determined by individual Sellers. SwapAI may intervene in disputes
                at our discretion. If a Seller fails to deliver a purchased product, Buyers may be
                eligible for a refund through our dispute resolution process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Prohibited Conduct</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious software or harmful content</li>
                <li>Engage in fraud or misrepresentation</li>
                <li>Harass or abuse other users</li>
                <li>Attempt to circumvent platform fees</li>
                <li>Create multiple accounts to abuse promotions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Intellectual Property</h2>
              <p>
                Sellers retain ownership of their AI tools and products. By listing on SwapAI, Sellers
                grant us a license to display and promote their listings. SwapAI's branding, design,
                and platform features are our intellectual property and may not be copied or reproduced.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
              <p>
                SwapAI is provided "as is" without warranties of any kind. We are not liable for any
                indirect, incidental, or consequential damages arising from your use of the Platform.
                Our total liability shall not exceed the amount you paid us in the past 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
              <p>
                We may suspend or terminate your account at any time for violations of these terms or
                for any other reason at our discretion. Upon termination, your right to use the Platform
                ceases immediately. Provisions that by their nature should survive termination will remain in effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p>
                If you have questions about these Terms of Service, please contact us through our
                <Link to="/support" className="text-violet-400 hover:text-violet-300 ml-1">Support page</Link>.
              </p>
            </section>

          </div>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link to="/" className="text-violet-400 hover:text-violet-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
