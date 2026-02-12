import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Target, Users, Shield, ArrowRight, ChevronDown, ShoppingBag, Store, MessageSquare, HelpCircle } from 'lucide-react'

const faqs = {
  buyers: [
    {
      question: "How do I buy a product?",
      answer: "Click on any listing to view details, then click \"Buy Now\" to choose your payment method. You can pay with Card (via Stripe) or Cryptocurrency (via Coinbase Commerce). For free products, simply click \"Get for Free\" to claim them."
    },
    {
      question: "Where can I find my purchases?",
      answer: "Go to your Dashboard and scroll down to the \"My Purchases\" section. Here you'll see all products you've bought, including the seller info, amount paid, and purchase date."
    },
    {
      question: "How do I receive my product after buying?",
      answer: "After your purchase, a conversation is automatically started with the seller. They will send you the delivery files, download links, or access instructions through the messaging system. You can access your messages from the Dashboard or Messages page."
    },
    {
      question: "Can I save listings to view later?",
      answer: "Yes! Click the bookmark icon on any listing to save it. You can view all your saved listings in the \"Saved Listings\" section of your Dashboard."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept credit/debit cards (via Stripe) and cryptocurrency (via Coinbase Commerce). Crypto payments have a lower platform fee (8.5%) compared to card payments (10%)."
    }
  ],
  sellers: [
    {
      question: "What are the platform fees?",
      answer: "Card payments: 10% platform fee. Crypto payments: 8.5% platform fee. The rest goes directly to you. For example, on a $100 sale via card, you receive $90. Via crypto, you receive $91.50."
    },
    {
      question: "How do I get paid for card payments?",
      answer: "Connect your Stripe account in Dashboard → Payment Setup. Once connected, card payments go directly to your Stripe account, minus the 10% platform fee. Stripe handles the payout to your bank."
    },
    {
      question: "How do I get paid for crypto payments?",
      answer: "Add your cryptocurrency wallet address in Dashboard → Payment Setup. Crypto payouts are processed manually. Make sure your wallet address is correct before receiving payments."
    },
    {
      question: "How do I deliver products to buyers?",
      answer: "After someone purchases your product, go to Messages and find the buyer's conversation. Use the paperclip button to attach files (up to 10MB) or paste download links directly in the message."
    },
    {
      question: "Do all listings get approved automatically?",
      answer: "Regular listings are approved automatically and go live immediately. NSFW listings require manual admin approval before they become visible in the marketplace."
    }
  ],
  general: [
    {
      question: "What file types can I send in messages?",
      answer: "You can send images (JPG, PNG, GIF), documents (PDF, DOC, DOCX, TXT), and archives (ZIP, RAR). Maximum file size is 10MB per file."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes! We never store your payment details. Card payments are processed securely through Stripe, and crypto payments go through Coinbase Commerce. Both are industry-leading payment processors."
    },
    {
      question: "How do I change my password?",
      answer: "Go to Dashboard → Edit Profile → Change Password. Enter your new password and confirm it to update."
    },
    {
      question: "Can I edit my listing after publishing?",
      answer: "Yes! Go to Dashboard → My Listings and click the edit icon next to any listing to update its details, images, or pricing."
    }
  ]
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-slate-800 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-violet-400 transition-colors"
      >
        <span className="font-medium text-white pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-4 text-slate-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

function FAQSection({ title, icon: Icon, items, color }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        {title}
      </h3>
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-6">
        {items.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  )
}

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20">
      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-300">About SwapAI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              The AI Tools Marketplace
            </span>
          </h1>

          <p className="text-2xl font-semibold text-slate-300 mb-6 italic">
            "From Code to Close – Swap Ai"
          </p>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            We're building the premier destination for discovering, buying, and selling AI tools.
            Connecting innovative builders with businesses ready to harness the power of AI.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-slate-400 mb-4">
                The AI revolution is here, but finding the right tools shouldn't be hard. We created SwapAI
                to bridge the gap between talented AI builders and the businesses that need their solutions.
              </p>
              <p className="text-slate-400 mb-4">
                Whether you've built an incredible AI model, automation tool, or SaaS product — SwapAI gives
                you a platform to reach customers worldwide. And for buyers, we provide a curated, trusted
                marketplace where every tool is vetted for quality.
              </p>
              <p className="text-slate-400">
                Our goal is simple: make AI accessible to everyone, and help builders get paid for their work.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-20" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">For Builders</h3>
                      <p className="text-sm text-slate-400">Monetize your AI creations. Keep up to 91.5% of every sale.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">For Buyers</h3>
                      <p className="text-sm text-slate-400">Find production-ready AI tools. No hidden fees.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Trust & Security</h3>
                      <p className="text-sm text-slate-400">Secure payments. Verified sellers. Quality guaranteed.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>

          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Simple Pricing</h3>
              <p className="text-slate-400">
                We charge <span className="text-violet-400 font-semibold">10% for card payments</span> and{' '}
                <span className="text-orange-400 font-semibold">8.5% for crypto payments</span>.
                Sellers keep up to 91.5% of their revenue. No monthly fees, no hidden charges.
                You only pay when you make money.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Secure Payments</h3>
              <p className="text-slate-400">
                Card payments are processed through Stripe, and crypto payments through Coinbase Commerce —
                both industry leaders in payment security. Sellers receive payouts directly. Buyers get
                purchase protection on every transaction.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Quality First</h3>
              <p className="text-slate-400">
                Every tool listed on SwapAI is reviewed by our team. We verify functionality, check
                documentation, and ensure sellers can deliver on their promises. Bad actors are
                removed immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50" id="faq">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know about buying and selling on SwapAI</p>
          </div>

          <FAQSection
            title="For Buyers"
            icon={ShoppingBag}
            items={faqs.buyers}
            color="bg-emerald-500/20 text-emerald-400"
          />

          <FAQSection
            title="For Sellers"
            icon={Store}
            items={faqs.sellers}
            color="bg-violet-500/20 text-violet-400"
          />

          <FAQSection
            title="General"
            icon={Shield}
            items={faqs.general}
            color="bg-fuchsia-500/20 text-fuchsia-400"
          />

          {/* Contact Section */}
          <div className="mt-8 text-center">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <MessageSquare className="w-10 h-10 text-violet-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Still have questions?</h3>
              <p className="text-slate-400 mb-4">Can't find what you're looking for? Reach out to us!</p>
              <a
                href="mailto:Support@swapai.shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-medium transition-all"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to join?</h2>
          <p className="text-slate-400 mb-8">
            Whether you're a builder looking to sell your AI tools or a buyer searching for solutions,
            SwapAI is the place for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-lg font-semibold transition-all"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/marketplace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-lg font-medium transition-all"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
