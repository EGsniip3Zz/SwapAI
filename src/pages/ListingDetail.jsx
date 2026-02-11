import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import {
  ExternalLink, ArrowLeft, Globe, Code,
  MessageSquare, Shield, Clock, Users, Zap, CreditCard, Bitcoin, CheckCircle
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function ListingDetail() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const purchaseStatus = searchParams.get('purchase')

  useEffect(() => {
    fetchListing()
  }, [id])

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles (
            id,
            full_name,
            avatar_url,
            stripe_account_id
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setListing(data)
    } catch (error) {
      console.error('Error fetching listing:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyWithCard = async () => {
    if (!user) return
    setPurchasing(true)
    try {
      const response = await fetch(`${API_URL}/api/stripe/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          listingTitle: listing.title,
          price: listing.price,
          sellerStripeAccountId: listing.profiles?.stripe_account_id,
          buyerEmail: user.email
        })
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error.message || 'Failed to start checkout')
    } finally {
      setPurchasing(false)
    }
  }

  const handleBuyWithCrypto = async () => {
    if (!user) return
    setPurchasing(true)
    try {
      const response = await fetch(`${API_URL}/api/coinbase/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          listingTitle: listing.title,
          price: listing.price,
          sellerId: listing.profiles?.id,
          buyerEmail: user.email
        })
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      window.location.href = data.url
    } catch (error) {
      console.error('Crypto checkout error:', error)
      alert(error.message || 'Failed to start crypto checkout')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-800 rounded w-1/4" />
            <div className="aspect-video bg-slate-800 rounded-2xl" />
            <div className="h-6 bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-800 rounded w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-4">Listing not found</h1>
          <Link to="/marketplace" className="text-violet-400 hover:text-violet-300">
            Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const categoryLabels = {
    'text-nlp': 'Text & NLP',
    'image-gen': 'Image Gen',
    'voice-audio': 'Voice & Audio',
    'video': 'Video',
    'data-analysis': 'Data Analysis',
    'automation': 'Automation',
    'other': 'Other',
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="aspect-video bg-slate-800 rounded-2xl overflow-hidden">
              {listing.image_url ? (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20">
                  <span className="text-8xl">{listing.emoji || '🤖'}</span>
                </div>
              )}
            </div>

            {/* Title and Meta */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium">
                  {categoryLabels[listing.category] || 'Other'}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">{listing.title}</h1>
              <p className="text-lg text-slate-400">{listing.short_description}</p>
            </div>

            {/* Full Description */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">About this tool</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 whitespace-pre-wrap">{listing.description}</p>
              </div>
            </div>

            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Key Features</h2>
                <ul className="space-y-3">
                  {listing.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack / Integration */}
            {listing.tech_stack && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Tech Stack & Integration</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.tech_stack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24">
              {/* Purchase Success Message */}
              {purchaseStatus === 'success' && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-400 mb-1">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Purchase Successful!</span>
                  </div>
                  <p className="text-sm text-slate-400">Thank you for your purchase. The seller will be notified.</p>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-1">
                  {listing.price_type === 'free' ? 'Free' :
                   listing.price_type === 'contact' ? 'Contact for Pricing' :
                   `$${listing.price}${listing.price_type === 'monthly' ? '/mo' : ''}`}
                </div>
                {listing.price_type === 'monthly' && (
                  <p className="text-sm text-slate-500">Billed monthly, cancel anytime</p>
                )}
              </div>

              {/* Buy Button - shows payment options */}
              {listing.price_type !== 'free' && listing.price_type !== 'contact' && listing.price > 0 && user && listing.profiles?.id !== user.id && (
                <div className="mb-4">
                  {!showPaymentOptions ? (
                    <button
                      onClick={() => setShowPaymentOptions(true)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg text-white font-semibold transition-all"
                    >
                      Buy Now - ${listing.price}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-400 text-center mb-3">Choose payment method:</p>
                      <button
                        onClick={handleBuyWithCard}
                        disabled={purchasing || !listing.profiles?.stripe_account_id}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CreditCard className="w-4 h-4" />
                        {purchasing ? 'Processing...' : 'Pay with Card'}
                        <span className="text-xs opacity-75">(10% fee)</span>
                      </button>
                      <button
                        onClick={handleBuyWithCrypto}
                        disabled={purchasing}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Bitcoin className="w-4 h-4" />
                        {purchasing ? 'Processing...' : 'Pay with Crypto'}
                        <span className="text-xs opacity-75">(8.5% fee)</span>
                      </button>
                      {!listing.profiles?.stripe_account_id && (
                        <p className="text-xs text-yellow-400 text-center">Card payment unavailable - seller hasn't connected Stripe</p>
                      )}
                      <button
                        onClick={() => setShowPaymentOptions(false)}
                        className="w-full text-sm text-slate-500 hover:text-slate-400"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Login to Buy */}
              {listing.price_type !== 'free' && listing.price_type !== 'contact' && listing.price > 0 && !user && (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg text-white font-semibold transition-all mb-4"
                >
                  Login to Buy - ${listing.price}
                </Link>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                {listing.demo_url && (
                  <a
                    href={listing.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-semibold transition-all"
                  >
                    Try Demo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {listing.website_url && (
                  <a
                    href={listing.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
                {listing.docs_url && (
                  <a
                    href={listing.docs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-all"
                  >
                    <Code className="w-4 h-4" />
                    Documentation
                  </a>
                )}
              </div>

              {/* Quick Info */}
              <div className="space-y-3 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">Verified by SwapAI</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">
                    Listed {new Date(listing.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">
                    {listing.purchase_count || 0} purchases
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">About the Seller</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold">
                  {listing.profiles?.full_name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-medium text-white">{listing.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-sm text-slate-500">Tool Builder</p>
                </div>
              </div>
              {user && listing.profiles?.id !== user.id && (
                <Link
                  to={`/messages?seller=${listing.profiles?.id}&listing=${listing.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact Seller
                </Link>
              )}
              {!user && (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Login to Contact
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
