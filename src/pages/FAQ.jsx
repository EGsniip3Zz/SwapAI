import { useState } from 'react'
import { ChevronDown, ShoppingBag, Store, HelpCircle, CreditCard, MessageSquare, FileText, Shield } from 'lucide-react'

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
    },
    {
      question: "How do I contact a seller?",
      answer: "You can message any seller by clicking \"Contact Seller\" on their listing page. After purchasing, a conversation is automatically created for you."
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
      answer: "After someone purchases your product, go to Messages and find the buyer's conversation. Use the paperclip button (📎) to attach files (up to 10MB) or paste download links directly in the message."
    },
    {
      question: "Where can I see my sales?",
      answer: "Go to your Dashboard and find the \"My Sales\" section. It shows all your orders, total sales count, total revenue earned, and lets you message each buyer directly."
    },
    {
      question: "How do I become a seller?",
      answer: "Go to Dashboard → Edit Profile and change your account type to \"Seller\". Then you can create listings by clicking \"List a Tool\" or going to the Sell page."
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
      question: "What if I forgot my password?",
      answer: "Click \"Forgot Password\" on the login page and enter your email. You'll receive a link to reset your password."
    },
    {
      question: "How do listing views work?",
      answer: "Every time someone views your listing, the view count increases. You can see view counts on each listing to track interest in your products."
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
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {title}
      </h2>
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-6">
        {items.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-400">Everything you need to know about buying and selling on SwapAI</p>
        </div>

        {/* FAQ Sections */}
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
        <div className="mt-12 text-center">
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
    </div>
  )
}
