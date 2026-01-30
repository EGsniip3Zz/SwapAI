import { Mail, MessageSquare, FileText, HelpCircle, ExternalLink } from 'lucide-react'

export default function Support() {
  const supportEmail = 'support@swapai.com' // Replace with your actual support email

  const faqs = [
    {
      question: 'How do I list my AI tool on SwapAI?',
      answer: 'Sign up as a seller, then click "Sell a Tool" in the navigation. Fill out the listing form with your tool details, pricing, and links. Your listing will be automatically approved and reviewed by our team shortly after.'
    },
    {
      question: 'What fees does SwapAI charge?',
      answer: 'SwapAI charges a 15% transaction fee on all sales. This covers payment processing, platform maintenance, and customer support. There are no listing fees or monthly charges.'
    },
    {
      question: 'How do I contact a seller?',
      answer: 'On any listing page, click the "Contact Seller" button to send them a message. You can also find their website and documentation links on the listing.'
    },
    {
      question: 'Can I request a refund?',
      answer: 'Refund policies are set by individual sellers. Check the listing details for refund information, or contact the seller directly. For disputes, reach out to our support team.'
    },
    {
      question: 'How do I become a verified seller?',
      answer: 'All sellers are automatically verified when they list their first tool. Our team reviews listings to ensure quality and security. Consistent quality listings can earn you a "Top Seller" badge.'
    },
    {
      question: 'What types of AI tools can I list?',
      answer: 'You can list APIs, SaaS products, SDKs, pre-trained models, AI agents, automation tools, and more. Tools must be production-ready and comply with our terms of service.'
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">How can we help?</h1>
          <p className="text-lg text-slate-400">
            Get in touch with our support team or find answers in our FAQ
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Email Support */}
          <a
            href={`mailto:${supportEmail}`}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-violet-500/50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Email Support</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Get help from our support team. We typically respond within 24 hours.
                </p>
                <span className="inline-flex items-center gap-2 text-violet-400 font-medium">
                  {supportEmail}
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </div>
          </a>

          {/* Documentation */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-fuchsia-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Documentation</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Browse our guides and documentation for sellers and buyers.
                </p>
                <span className="text-slate-500 text-sm">Coming soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                  <span className="font-medium text-white pr-4">{faq.question}</span>
                  <svg
                    className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-slate-400">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-2">Still have questions?</h3>
          <p className="text-slate-400 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href={`mailto:${supportEmail}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-semibold transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
