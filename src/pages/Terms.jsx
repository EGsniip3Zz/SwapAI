import { Link } from 'react-router-dom'
import { Zap, Shield } from 'lucide-react'

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
          <p className="text-slate-400">Last updated: February 2026</p>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Important Notice</h3>
              <p className="text-slate-300 text-sm">
                PLEASE READ THESE TERMS CAREFULLY. BY USING SWAPAI, YOU AGREE TO BE BOUND BY THESE TERMS.
                SWAPAI IS A MARKETPLACE PLATFORM ONLY - WE DO NOT CREATE, ENDORSE, OR GUARANTEE ANY PRODUCTS
                LISTED BY SELLERS. ALL TRANSACTIONS ARE BETWEEN BUYERS AND SELLERS DIRECTLY.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <div className="space-y-8 text-slate-300">

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using SwapAI ("the Platform," "we," "us," or "our"), you ("User," "you," or "your")
                agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms,
                you must immediately cease using the Platform. We reserve the right to modify these Terms at any time
                without prior notice. Your continued use of the Platform following any changes constitutes acceptance
                of those changes. It is your responsibility to review these Terms periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Platform Description & Disclaimer</h2>
              <p className="mb-4">
                SwapAI is an online marketplace that connects AI tool creators ("Sellers") with potential
                purchasers ("Buyers"). <strong className="text-white">SWAPAI IS A PLATFORM ONLY.</strong> We do not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Create, develop, or own any products listed on the Platform</li>
                <li>Verify the accuracy, quality, safety, or legality of listed products</li>
                <li>Guarantee that products will meet your expectations or requirements</li>
                <li>Endorse any Seller or their products</li>
                <li>Guarantee the identity, qualifications, or capabilities of any Seller</li>
                <li>Guarantee that any transaction will be completed satisfactorily</li>
              </ul>
              <p>
                All transactions are conducted directly between Buyers and Sellers. SwapAI is not a party to
                any transaction and bears no responsibility for the actions, products, or conduct of any User.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts & Eligibility</h2>
              <p className="mb-3">You must be at least 18 years old to use this Platform. By creating an account, you represent and warrant that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All information you provide is accurate, current, and complete</li>
                <li>You will maintain and update your information to keep it accurate</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You will maintain the confidentiality of your account credentials</li>
                <li>You accept full responsibility for all activities under your account</li>
                <li>You will notify us immediately of any unauthorized access to your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Seller Terms & Responsibilities</h2>
              <p className="mb-3">If you list products on SwapAI as a Seller, you represent, warrant, and agree that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You have all necessary rights, licenses, and permissions to sell the listed products</li>
                <li>Your products do not infringe any third-party intellectual property rights</li>
                <li>All product descriptions are accurate, complete, and not misleading</li>
                <li>You will deliver purchased products as described in a timely manner</li>
                <li>You will provide reasonable support to Buyers</li>
                <li>You comply with all applicable laws, regulations, and tax obligations</li>
                <li>You will not engage in fraudulent, deceptive, or misleading practices</li>
              </ul>
              <p className="mt-4">
                <strong className="text-white">Platform Fee:</strong> SwapAI charges a 10% platform fee on all transactions.
                Sellers receive 90% of the sale price, minus payment processing fees (approximately 2.9% + $0.30 per transaction).
              </p>
              <p className="mt-4">
                <strong className="text-white">Seller Indemnification:</strong> Sellers agree to indemnify and hold harmless
                SwapAI from any claims, damages, or expenses arising from their products, listings, or conduct.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Buyer Terms & Acknowledgments</h2>
              <p className="mb-3">If you purchase products on SwapAI as a Buyer, you acknowledge and agree that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">BUYER BEWARE:</strong> You are solely responsible for evaluating
                  the suitability, quality, and legitimacy of any product before purchase</li>
                <li>SwapAI does not guarantee, endorse, or verify any product or Seller</li>
                <li>All purchases are made at your own risk</li>
                <li>You will conduct your own due diligence before making any purchase</li>
                <li>You will use purchased products in accordance with their licenses</li>
                <li>You will not hold SwapAI responsible for any issues with purchased products</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. No Warranty & "As-Is" Disclaimer</h2>
              <p className="mb-4 uppercase text-sm">
                <strong className="text-white">
                  THE PLATFORM AND ALL PRODUCTS LISTED THEREON ARE PROVIDED "AS IS" AND "AS AVAILABLE"
                  WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
                  IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                </strong>
              </p>
              <p className="mb-4">
                SwapAI makes no warranty that: (a) the Platform will meet your requirements; (b) the Platform
                will be uninterrupted, timely, secure, or error-free; (c) any products purchased will meet
                your expectations; (d) any errors in the Platform will be corrected.
              </p>
              <p>
                Any material downloaded or otherwise obtained through the Platform is done at your own discretion
                and risk, and you will be solely responsible for any damage to your computer system or loss of
                data that results from the download of any such material.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
              <p className="mb-4 uppercase text-sm">
                <strong className="text-white">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SWAPAI, ITS OFFICERS,
                  DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE,
                  GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                </strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Your access to or use of (or inability to access or use) the Platform</li>
                <li>Any conduct or content of any third party on the Platform, including Sellers</li>
                <li>Any products obtained from Sellers through the Platform</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                <li>Any transaction or relationship between you and any Seller</li>
                <li>Any fraudulent, deceptive, or illegal conduct by other Users</li>
              </ul>
              <p>
                <strong className="text-white">IN NO EVENT SHALL SWAPAI'S TOTAL LIABILITY TO YOU EXCEED
                THE GREATER OF (A) THE AMOUNT YOU PAID TO SWAPAI IN THE TWELVE (12) MONTHS PRIOR TO THE
                CLAIM OR (B) ONE HUNDRED DOLLARS ($100).</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless SwapAI, its officers, directors, employees,
                agents, and affiliates from and against any and all claims, damages, obligations, losses,
                liabilities, costs, or debt, and expenses (including but not limited to attorney's fees)
                arising from: (a) your use of and access to the Platform; (b) your violation of any term
                of these Terms; (c) your violation of any third-party right, including any intellectual
                property or privacy right; (d) any claim that your content or products caused damage to
                a third party; or (e) any transaction between you and another User.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Dispute Resolution Between Users</h2>
              <p className="mb-4">
                <strong className="text-white">SwapAI is not responsible for resolving disputes between Users.</strong>
                Any disputes arising from transactions must be resolved directly between the Buyer and Seller.
                While we may, at our sole discretion, attempt to assist in dispute resolution, we are under
                no obligation to do so and make no guarantees regarding the outcome of any dispute.
              </p>
              <p>
                Users agree to release SwapAI from any and all claims, demands, and damages (actual and
                consequential) of every kind and nature, known and unknown, arising out of or in any way
                connected with disputes between Users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Payments, Refunds & Chargebacks</h2>
              <p className="mb-4">
                All payments are processed through Stripe. By making a purchase, you authorize SwapAI to
                charge your payment method for the total amount of your order.
              </p>
              <p className="mb-4">
                <strong className="text-white">Refund Policy:</strong> Refund policies are determined by
                individual Sellers. SwapAI does not guarantee refunds for any purchase. Any refund requests
                must be directed to the Seller first.
              </p>
              <p>
                <strong className="text-white">Chargebacks:</strong> Fraudulent chargebacks or payment disputes
                may result in immediate account termination and legal action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Prohibited Conduct</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious software, viruses, or harmful content</li>
                <li>Engage in fraud, scams, or misrepresentation</li>
                <li>Harass, abuse, or threaten other users</li>
                <li>Attempt to circumvent platform fees</li>
                <li>Create multiple accounts to abuse the platform</li>
                <li>Scrape, harvest, or collect user data without consent</li>
                <li>Interfere with or disrupt the Platform or servers</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Termination</h2>
              <p>
                We may suspend or terminate your account at any time, for any reason, with or without notice,
                including for violations of these Terms. Upon termination, your right to use the Platform
                ceases immediately. We are not liable for any damages resulting from termination.
                Sections 6, 7, 8, and 9 shall survive termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law & Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Province of
                British Columbia, Canada, without regard to its conflict of law provisions. Any legal action
                or proceeding arising under these Terms shall be brought exclusively in the courts located in
                British Columbia, Canada, and you hereby consent to personal jurisdiction and venue therein.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall
                be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise
                remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">15. Entire Agreement</h2>
              <p>
                These Terms constitute the entire agreement between you and SwapAI regarding the use of
                the Platform, superseding any prior agreements. Our failure to exercise or enforce any
                right or provision of these Terms shall not constitute a waiver of such right or provision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">16. Contact Us</h2>
              <p>
                If you have questions about these Terms of Service, please contact us through our
                <Link to="/support" className="text-violet-400 hover:text-violet-300 ml-1">Support page</Link>.
              </p>
            </section>

          </div>
        </div>

        {/* Links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-4">
          <Link to="/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">
            Privacy Policy →
          </Link>
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
