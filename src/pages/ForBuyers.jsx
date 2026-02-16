import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, TrendingUp, Zap, ArrowRight, CheckCircle } from 'lucide-react'

export default function ForBuyers() {
  useEffect(() => {
    document.title = 'Request Access to AI Business Listings | SwapAi'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Get private access to high-quality AI tools and MRR businesses for sale. Serious buyers only. Submit your interest now.')
  }, [])

  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', budget: '', interests: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now just show success - can hook up to Supabase or email later
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
            <Shield className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-400 font-medium">Serious Buyers Only</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Acquire Profitable AI Tools
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Get private access to high-quality AI tools and MRR businesses for sale. We connect serious buyers with vetted AI assets.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-violet-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Proven Revenue</h3>
            <p className="text-sm text-slate-400">Every listing has verified MRR and real customer data</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <Shield className="w-8 h-8 text-fuchsia-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Vetted Assets</h3>
            <p className="text-sm text-slate-400">We review every listing for code quality, defensibility, and growth potential</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <Zap className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Fast Transfers</h3>
            <p className="text-sm text-slate-400">Secure payment escrow and smooth handoff process</p>
          </div>
        </div>

        {/* Form or Success */}
        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">You're on the list</h2>
            <p className="text-slate-400 mb-6">We'll reach out with curated listings that match your criteria.</p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full text-white font-semibold transition-all"
            >
              Browse Public Listings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Request Access</h2>
            <p className="text-slate-400 text-center mb-8">Tell us what you're looking for and we'll match you with the right opportunities.</p>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Budget Range</label>
                <select
                  value={form.budget}
                  onChange={(e) => setForm({...form, budget: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Select budget range</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-25k">$5,000 – $25,000</option>
                  <option value="25k-100k">$25,000 – $100,000</option>
                  <option value="100k+">$100,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">What are you looking for?</label>
                <textarea
                  value={form.interests}
                  onChange={(e) => setForm({...form, interests: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="e.g. AI chatbot with $5k+ MRR, content generation tool, etc."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-semibold transition-all"
              >
                Submit Interest
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
