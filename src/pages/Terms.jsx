import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign Up
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-slate-400 mb-8">Last updated: February 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-slate-300">
                By accessing or using SwapAI ("the Platform"), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Platform Description</h2>
              <p className="text-slate-300">
                SwapAI is an online marketplace that connects buyers and sellers of AI tools, software, and related digital products.
                We provide the platform infrastructure but do not create, own, or control the products listed by sellers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
              <p className="text-slate-300">
                You must provide accurate information when creating an account. You are responsible for maintaining
                the security of your account and all activities that occur under it. You must be at least 18 years old to use this Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Buyer Responsibilities</h2>
              <p className="text-slate-300">
                As a buyer, you agree to review product listings carefully before purchase. All sales are between you and the seller.
                You are responsible for communicating with sellers regarding product delivery and any issues.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Seller Responsibilities</h2>
              <p className="text-slate-300">
                As a seller, you agree to provide accurate descriptions of your products, deliver purchased items promptly,
                and respond to buyer inquiries in a timely manner. You represent that you have all necessary rights to sell the products you list.
              </p>
            </section>

            <section className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-amber-400 mb-3">6. Limitation of Liability — IMPORTANT</h2>
              <p className="text-slate-300 mb-4">
                <strong className="text-white">SwapAI acts solely as a marketplace platform and is NOT a party to transactions between buyers and sellers.</strong>
              </p>
              <p className="text-slate-300 mb-4">
                SwapAI is not responsible for:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4">
                <li>The quality, safety, legality, or accuracy of any listings or products</li>
                <li>The ability of sellers to deliver products or buyers to pay</li>
                <li>Any disputes, claims, or damages arising from transactions between users</li>
                <li>Product performance, functionality, or fitness for any particular purpose</li>
                <li>Any loss of data, revenue, or profits related to products purchased</li>
                <li>Refunds, chargebacks, or payment disputes between parties</li>
              </ul>
              <p className="text-slate-300">
                <strong className="text-white">All transactions are conducted at your own risk.</strong> Buyers and sellers are solely responsible
                for resolving any disputes between themselves. SwapAI disclaims all liability for any claims, damages, or losses
                arising from your use of the Platform or transactions with other users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Fees and Payments</h2>
              <p className="text-slate-300">
                SwapAI charges a platform fee on successful transactions (10% for card payments, 8.5% for cryptocurrency).
                Fees are deducted automatically at the time of sale. Sellers receive the remaining balance minus payment processor fees.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Prohibited Content</h2>
              <p className="text-slate-300">
                Users may not list or sell products that are illegal, fraudulent, infringing on intellectual property rights,
                harmful, or violate any applicable laws. SwapAI reserves the right to remove any content and suspend accounts
                that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Intellectual Property</h2>
              <p className="text-slate-300">
                Sellers retain ownership of their products and grant buyers a license as specified in their listings.
                SwapAI retains ownership of the Platform and all related trademarks, logos, and branding.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Dispute Resolution</h2>
              <p className="text-slate-300">
                In the event of a dispute between buyers and sellers, we encourage users to first attempt to resolve the issue
                directly. SwapAI may, at its sole discretion, provide mediation assistance but is under no obligation to do so.
                Any unresolved disputes shall be handled through binding arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">11. Termination</h2>
              <p className="text-slate-300">
                SwapAI may suspend or terminate your account at any time for violations of these terms or for any other reason
                at our sole discretion. Upon termination, you remain liable for any pending transactions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">12. Changes to Terms</h2>
              <p className="text-slate-300">
                We reserve the right to modify these Terms of Service at any time. Continued use of the Platform after changes
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">13. Contact</h2>
              <p className="text-slate-300">
                For questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:Support@swapai.shop" className="text-violet-400 hover:text-violet-300">
                  Support@swapai.shop
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-semibold transition-all"
            >
              Back to Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
