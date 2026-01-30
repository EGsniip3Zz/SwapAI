import { Link } from 'react-router-dom'
import { Zap, Star, Shield, Code, DollarSign, Users, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { user } = useAuth()

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

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300">The AI Tools Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-white">The Premier Marketplace</span>
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              for AI Tools
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
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white">500+</div>
              <div className="text-sm text-slate-500 mt-1">AI Tools Listed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white">10K+</div>
              <div className="text-sm text-slate-500 mt-1">Active Users</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white">$2M+</div>
              <div className="text-sm text-slate-500 mt-1">Transaction Volume</div>
            </div>
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
              { name: 'Text & NLP', count: '120+', emoji: '📝' },
              { name: 'Image Gen', count: '85+', emoji: '🎨' },
              { name: 'Voice & Audio', count: '45+', emoji: '🎙️' },
              { name: 'Video', count: '60+', emoji: '🎬' },
              { name: 'Data Analysis', count: '90+', emoji: '📊' },
              { name: 'Automation', count: '75+', emoji: '⚡' },
            ].map((category, index) => (
              <Link
                key={index}
                to={`/marketplace?category=${category.name.toLowerCase().replace(' & ', '-')}`}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center hover:border-violet-500/50 hover:bg-slate-800 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl mb-2">{category.emoji}</div>
                <div className="font-medium text-white text-sm mb-1">{category.name}</div>
                <div className="text-xs text-slate-500">{category.count} tools</div>
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

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text-simple">SwapAI</span>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/marketplace" className="text-slate-400 hover:text-white transition-colors text-sm">Marketplace</Link>
              <Link to="/sell" className="text-slate-400 hover:text-white transition-colors text-sm">Sell</Link>
              <Link to="/support" className="text-slate-400 hover:text-white transition-colors text-sm">Support</Link>
              <Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">About</Link>
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Terms</Link>
            </div>

            <p className="text-slate-500 text-sm">
              &copy; 2025 SwapAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
