import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Star, Shield, Code, DollarSign, Users, ArrowRight, BadgeCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import ListingsCarousel from '../components/ListingsCarousel'

export default function Home() {
  const { user } = useAuth()

  useEffect(() => {
    document.title = 'SwapAi — Buy & Sell Profitable AI Tools, Chatbots & MRR Businesses'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Marketplace for acquiring and exiting AI tools, chatbots, workflows, and recurring revenue assets. Browse listings or list your AI asset today.')
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 rounded-full blur-3xl" />
        </div>

        {/* Social Icons - Top Right */}
        <div className="absolute top-4 right-4 sm:right-8 flex items-center gap-3 z-10">
          <a
            href="https://x.com/SwapAi_Shop"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-slate-800/70 hover:bg-slate-700 border border-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all"
            title="Follow us on X"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a
            href="https://www.instagram.com/swapaishop"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 bg-slate-800/70 hover:bg-slate-700 border border-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all"
            title="Follow us on Instagram"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300">The AI Tools Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-white">The Marketplace for</span>
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              AI Revenue Generators
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-10">
            Where innovative AI builders meet forward-thinking businesses. Discover, evaluate, and deploy
            production-ready AI tools — or monetize your own creations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-lg font-semibold transition-all duration-200 shadow-xl shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-105"
            >
              Browse Marketplace
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/sell"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-lg font-medium transition-all duration-200"
            >
              Sell Your Tool
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 pt-12 border-t border-slate-800">
            <div className="text-center">
              <Shield className="w-8 h-8 text-violet-400 mx-auto mb-2" />
              <div className="text-lg font-semibold text-white">Secure Payments</div>
              <div className="text-sm text-slate-500 mt-1">Stripe & Crypto</div>
            </div>
            <div className="text-center">
              <BadgeCheck className="w-8 h-8 text-fuchsia-400 mx-auto mb-2" />
              <div className="text-lg font-semibold text-white">Verified Sellers</div>
              <div className="text-sm text-slate-500 mt-1">Vetted creators</div>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-lg font-semibold text-white">Instant Delivery</div>
              <div className="text-sm text-slate-500 mt-1">Download immediately</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Carousel */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Featured AI Tools
            </h2>
            <p className="text-slate-400">
              Discover the most popular tools on SwapAI
            </p>
          </div>
          <ListingsCarousel />
          <div className="text-center mt-8">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              View all tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How SwapAI Works
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              A seamless experience designed for both sides of the marketplace
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* For Builders */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-violet-400 rounded-2xl blur opacity-20" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                    <Code className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">For Builders</h3>
                </div>

                <div className="space-y-6">
                  {[
                    { step: '01', title: 'List Your AI Tool', description: 'Upload your tool with documentation, pricing tiers, and demo access.' },
                    { step: '02', title: 'Get Verified', description: 'Your listing goes live instantly. Our team reviews for quality.' },
                    { step: '03', title: 'Reach Customers', description: 'Get discovered by thousands of businesses actively seeking AI solutions.' },
                    { step: '04', title: 'Earn Revenue', description: 'Receive payments directly. Keep 90% of every sale you make.' },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-violet-400">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* For Buyers */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 rounded-2xl blur opacity-20" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-fuchsia-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">For Buyers</h3>
                </div>

                <div className="space-y-6">
                  {[
                    { step: '01', title: 'Browse & Discover', description: 'Explore curated AI tools across categories with detailed comparisons.' },
                    { step: '02', title: 'Try Before You Buy', description: 'Access live demos, sandboxes, and free trials to evaluate fit.' },
                    { step: '03', title: 'Purchase Securely', description: 'One-click licensing with transparent pricing. No hidden fees.' },
                    { step: '04', title: 'Integrate & Scale', description: 'Get API keys, SDKs, and dedicated support for seamless deployment.' },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-fuchsia-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-fuchsia-400">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for the AI Economy
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Everything you need to buy, sell, and deploy AI tools with confidence
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Vetted & Verified', description: 'Every tool undergoes rigorous security, performance, and quality review before listing.', color: 'violet' },
              { icon: DollarSign, title: 'Flexible Pricing', description: 'Support for one-time purchases, subscriptions, usage-based billing, and custom enterprise deals.', color: 'fuchsia' },
              { icon: Code, title: 'API-First Design', description: 'Every tool comes with comprehensive API documentation, SDKs, and integration guides.', color: 'pink' },
              { icon: Zap, title: 'Analytics Dashboard', description: 'Builders get deep insights into sales, usage patterns, and customer feedback.', color: 'violet' },
              { icon: Star, title: 'Community Reviews', description: 'Authentic ratings and reviews from verified purchasers help you make informed decisions.', color: 'fuchsia' },
              { icon: Users, title: 'Dedicated Support', description: 'Direct communication channels between buyers and builders, plus SwapAI support team.', color: 'pink' },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-${feature.color}-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Explore AI Tool Categories
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From content generation to computer vision — find the perfect AI tools for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Text & NLP', emoji: '📝' },
              { name: 'Image Gen', emoji: '🎨' },
              { name: 'Voice & Audio', emoji: '🎙️' },
              { name: 'Video', emoji: '🎬' },
              { name: 'Data Analysis', emoji: '📊' },
              { name: 'Automation', emoji: '⚡' },
            ].map((category, index) => (
              <Link
                key={index}
                to={`/marketplace?category=${category.name.toLowerCase().replace(' & ', '-')}`}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center hover:border-violet-500/50 hover:bg-slate-800 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl mb-2">{category.emoji}</div>
                <div className="font-medium text-white text-sm">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-3xl blur opacity-30" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-slate-400 mb-8">
                Join thousands of builders and buyers on the premier AI tools marketplace.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {!user ? (
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-full text-white font-semibold transition-all"
                  >
                    Create Account
                  </Link>
                ) : (
                  <Link
                    to="/sell"
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-full text-white font-semibold transition-all"
                  >
                    Start Selling
                  </Link>
                )}
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full text-white font-medium transition-all"
                >
                  Browse Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

          </div>
  )
}
