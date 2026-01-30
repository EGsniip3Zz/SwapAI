import { Link } from 'react-router-dom'
import { Zap, Target, Users, Shield, ArrowRight } from 'lucide-react'

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

          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              The AI Tools Marketplace
            </span>
          </h1>

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
                      <p className="text-sm text-slate-400">Monetize your AI creations. Keep 90% of every sale.</p>
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
                We charge a flat <span className="text-violet-400 font-semibold">10% platform fee</span> on
                all transactions. Sellers keep 90% of their revenue. No monthly fees, no hidden charges.
                You only pay when you make money.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Secure Payments</h3>
              <p className="text-slate-400">
                All payments are processed through Stripe, the industry leader in payment security.
                Sellers receive payouts directly to their bank account. Buyers get purchase protection
                on every transaction.
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

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
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
