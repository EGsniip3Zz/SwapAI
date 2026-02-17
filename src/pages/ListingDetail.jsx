import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import {
  ExternalLink, ArrowLeft, Globe, Code,
  MessageSquare, Shield, Clock, Users, Zap, CreditCard, Bitcoin, CheckCircle, Eye, Bookmark,
  Share2, Twitter, Linkedin, Link2, Copy, Check, Tag
} from 'lucide-react'
import OfferModal from '../components/OfferModal'
import Reviews from '../components/Reviews'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function ListingDetail() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [savingState, setSavingState] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [purchaseRecorded, setPurchaseRecorded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [badgeCopied, setBadgeCopied] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const purchaseStatus = searchParams.get('purchase')
  const paymentMethod = searchParams.get('method') || 'card'
  const processedPurchase = useRef(false)

  useEffect(() => {
    fetchListing()
    incrementViews()
  }, [id])

  useEffect(() => {
    if (user && listing) {
      checkIfSaved()
    }
  }, [user, listing])

  // Handle successful purchase - record it and start conversation
  useEffect(() => {
    if (purchaseStatus === 'success' && user && listing && !processedPurchase.current) {
      processedPurchase.current = true
      recordPurchaseAndStartConversation()
    }
  }, [purchaseStatus, user, listing])

  const recordPurchaseAndStartConversation = async () => {
    try {
      // Check if purchase already recorded (prevent duplicates)
      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('listing_id', listing.id)
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Within last 5 minutes
        .single()

      if (existingPurchase) {
        setPurchaseRecorded(true)
        return
      }

      // Record the purchase
      const platformFee = paymentMethod === 'crypto' ? 8.5 : 10
      const sellerAmount = listing.price * (1 - platformFee / 100)

      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          buyer_id: user.id,
          seller_id: listing.profiles?.id,
          listing_id: listing.id,
          amount: listing.price,
          platform_fee: listing.price * (platformFee / 100),
          seller_amount: sellerAmount,
          payment_method: paymentMethod,
          status: 'completed'
        })
        .select()
        .single()

      if (purchaseError) throw purchaseError

      // Auto-start conversation with purchase details
      const autoMessage = `🎉 I just purchased "${listing.title}" for $${listing.price}!\n\nPayment Method: ${paymentMethod === 'crypto' ? 'Cryptocurrency' : 'Card'}\nOrder ID: ${purchase.id}\n\nLooking forward to receiving the delivery details. Thanks!`

      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: listing.profiles?.id,
        listing_id: listing.id,
        content: autoMessage,
        is_system_message: true
      })

      // Update listing purchase count
      await supabase
        .from('listings')
        .update({ purchase_count: (listing.purchase_count || 0) + 1 })
        .eq('id', listing.id)

      // Send email notifications (optional - fails silently if not configured)
      try {
        // Get buyer and seller emails
        const { data: buyerProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        await fetch(`${API_URL}/api/notifications/purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyerEmail: user.email,
            buyerName: buyerProfile?.full_name || 'Buyer',
            sellerEmail: listing.profiles?.email || '',
            sellerName: listing.profiles?.full_name || 'Seller',
            listingTitle: listing.title,
            amount: listing.price,
            paymentMethod,
            purchaseId: purchase.id
          })
        })
      } catch (emailError) {
        console.log('Email notification skipped:', emailError)
      }

      setPurchaseRecorded(true)

      // Clear the URL params
      setSearchParams({})

    } catch (error) {
      console.error('Error recording purchase:', error)
    }
  }

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
            stripe_account_id,
            email
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

  const incrementViews = async () => {
    try {
      // Use RPC function to bypass RLS and increment views
      const { error } = await supabase.rpc('increment_listing_views', { listing_id: id })
      if (error) {
        console.log('View increment via RPC failed, RPC may not exist:', error.message)
      }
    } catch (error) {
      console.log('View increment error:', error)
    }
  }

  const checkIfSaved = async () => {
    try {
      const { data } = await supabase
        .from('saved_listings')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listing.id)
        .single()

      setIsSaved(!!data)
    } catch (error) {
      setIsSaved(false)
    }
  }

  const toggleSave = async () => {
    if (!user) return
    setSavingState(true)

    try {
      if (isSaved) {
        // Remove from saved
        await supabase
          .from('saved_listings')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listing.id)
        setIsSaved(false)
      } else {
        // Add to saved
        await supabase
          .from('saved_listings')
          .insert({ user_id: user.id, listing_id: listing.id })
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Error toggling save:', error)
    } finally {
      setSavingState(false)
    }
  }

  const getShareUrl = () => {
    return `${window.location.origin}/listing/${id}`
  }

  const shareOnTwitter = () => {
    const text = `Check out "${listing.title}" on SwapAI! 🚀`
    const url = getShareUrl()
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  const shareOnLinkedIn = () => {
    const url = getShareUrl()
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(getShareUrl())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getBadgeCode = () => {
    const badgeUrl = `${window.location.origin}/api/badge/${id}`
    const listingUrl = getShareUrl()
    return `<a href="${listingUrl}" target="_blank"><img src="${badgeUrl}" alt="Available on SwapAI" /></a>`
  }

  const copyBadgeCode = async () => {
    await navigator.clipboard.writeText(getBadgeCode())
    setBadgeCopied(true)
    setTimeout(() => setBadgeCopied(false), 2000)
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

  const handleGetFree = async () => {
    if (!user) return
    setPurchasing(true)
    try {
      // Check if already claimed
      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('listing_id', listing.id)
        .single()

      if (existingPurchase) {
        alert('You already have this product!')
        setPurchasing(false)
        return
      }

      // Record the free purchase
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          buyer_id: user.id,
          seller_id: listing.profiles?.id,
          listing_id: listing.id,
          amount: 0,
          platform_fee: 0,
          seller_amount: 0,
          payment_method: 'free',
          status: 'completed'
        })
        .select()
        .single()

      if (purchaseError) throw purchaseError

      // Auto-start conversation
      const autoMessage = `🎉 I just got "${listing.title}" (Free)!\n\nOrder ID: ${purchase.id}\n\nLooking forward to using it. Thanks for sharing!`

      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: listing.profiles?.id,
        listing_id: listing.id,
        content: autoMessage,
        is_system_message: true
      })

      // Update listing purchase count
      await supabase
        .from('listings')
        .update({ purchase_count: (listing.purchase_count || 0) + 1 })
        .eq('id', listing.id)

      // Navigate to messages
      navigate(`/messages?seller=${listing.profiles?.id}&listing=${listing.id}`)

    } catch (error) {
      console.error('Error claiming free product:', error)
      alert('Failed to claim product. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  const handleMakeOffer = async (offerAmount) => {
    if (!user || !listing) return

    try {
      // Check for existing pending offer
      const { data: existingOffer } = await supabase
        .from('offers')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('buyer_id', user.id)
        .eq('status', 'pending')
        .single()

      if (existingOffer) {
        throw new Error('You already have a pending offer on this listing')
      }

      // Create the offer
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .insert({
          listing_id: listing.id,
          buyer_id: user.id,
          seller_id: listing.profiles.id,
          amount: offerAmount,
          status: 'pending'
        })
        .select()
        .single()

      if (offerError) throw offerError

      // Create the offer message
      const { error: msgError } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: listing.profiles.id,
        listing_id: listing.id,
        content: `💰 Offer: $${offerAmount.toFixed(2)} for "${listing.title}" (listed at $${listing.price})`,
        message_type: 'offer',
        offer_id: offer.id
      })

      if (msgError) throw msgError

      setShowOfferModal(false)
      navigate(`/messages?seller=${listing.profiles.id}&listing=${listing.id}`)
    } catch (error) {
      throw error
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
            {/* Image Gallery */}
            <div className="space-y-3">
              {/* Main Image */}
              <div className="aspect-video bg-slate-800 rounded-2xl overflow-hidden">
                {(listing.images?.length > 0 || listing.image_url) ? (
                  <img
                    src={listing.images?.[activeImage] || listing.image_url}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20">
                    <span className="text-8xl">{listing.emoji || '🤖'}</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {listing.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === index ? 'border-violet-500' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${listing.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title and Meta */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm font-medium">
                    {categoryLabels[listing.category] || 'Other'}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <Eye className="w-4 h-4" />
                    {listing.views || 0} views
                  </span>
                </div>
                {user && listing.profiles?.id !== user.id && (
                  <button
                    onClick={toggleSave}
                    disabled={savingState}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isSaved
                        ? 'bg-violet-500/20 text-violet-400 border border-violet-500/50'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    {savingState ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">{listing.title}</h1>
              <p className="text-lg text-slate-400 mb-4">{listing.short_description}</p>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 mr-2">Share:</span>
                <button
                  onClick={shareOnTwitter}
                  className="p-2 bg-slate-800 hover:bg-[#1DA1F2] rounded-lg text-slate-400 hover:text-white transition-all"
                  title="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={shareOnLinkedIn}
                  className="p-2 bg-slate-800 hover:bg-[#0A66C2] rounded-lg text-slate-400 hover:text-white transition-all"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={copyLink}
                  className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                  {copied && <span className="text-xs">Copied!</span>}
                </button>
              </div>
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

            {/* Reviews Section */}
            <Reviews listingId={listing.id} sellerId={listing.profiles?.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24">
              {/* Purchase Success Message */}
              {purchaseStatus === 'success' && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Purchase Successful!</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    Thank you for your purchase! A conversation has been started with the seller.
                  </p>
                  <Link
                    to={`/messages?seller=${listing.profiles?.id}&listing=${listing.id}`}
                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    View Messages
                  </Link>
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

              {/* Get Free Button */}
              {listing.price_type === 'free' && user && listing.profiles?.id !== user.id && (
                <button
                  onClick={handleGetFree}
                  disabled={purchasing}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg text-white font-semibold transition-all mb-4 disabled:opacity-50"
                >
                  {purchasing ? 'Processing...' : 'Get for Free'}
                </button>
              )}

              {/* Login to Get Free */}
              {listing.price_type === 'free' && !user && (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg text-white font-semibold transition-all mb-4"
                >
                  Login to Get Free
                </Link>
              )}

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
                      </button>
                      <button
                        onClick={handleBuyWithCrypto}
                        disabled={purchasing}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Bitcoin className="w-4 h-4" />
                        {purchasing ? 'Processing...' : 'Pay with Crypto'}
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

              {/* Make Offer Button */}
              {listing.price_type !== 'free' && listing.price_type !== 'contact' && listing.price > 0 && user && listing.profiles?.id !== user.id && (
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-violet-500/50 rounded-lg text-white font-medium transition-all mb-4"
                >
                  <Tag className="w-4 h-4 text-violet-400" />
                  Make an Offer
                </button>
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
              <Link to={`/seller/${listing.profiles?.id}`} className="flex items-center gap-3 mb-4 group/seller">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold">
                  {listing.profiles?.full_name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-medium text-white group-hover/seller:text-violet-400 transition-colors">{listing.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-sm text-slate-500">View Profile →</p>
                </div>
              </Link>
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

            {/* Badge Embed Section - Only for listing owner */}
            {user && listing.profiles?.id === user.id && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Promote Your Listing</h3>
                <p className="text-sm text-slate-400 mb-4">Share your listing or add this badge to your website.</p>

                {/* Copy Link Button */}
                <button
                  onClick={copyLink}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg mb-4 font-medium transition-all ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                  {copied ? 'Link Copied!' : 'Copy Listing Link'}
                </button>

                {/* Badge Preview */}
                <p className="text-xs text-slate-500 mb-2">Embeddable badge:</p>
                <div className="bg-slate-800 rounded-lg p-4 mb-4 flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-white text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    Available on SwapAI
                  </div>
                </div>

                {/* Embed Code */}
                <div className="relative">
                  <pre className="bg-slate-950 rounded-lg p-3 text-xs text-slate-400 overflow-x-auto">
                    {getBadgeCode()}
                  </pre>
                  <button
                    onClick={copyBadgeCode}
                    className={`absolute top-2 right-2 p-1.5 rounded transition-all ${
                      badgeCopied
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
                    }`}
                  >
                    {badgeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {badgeCopied && (
                  <p className="text-xs text-emerald-400 mt-2">Copied to clipboard!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      <OfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onSubmit={handleMakeOffer}
        listingPrice={listing.price}
        listingTitle={listing.title}
      />
    </div>
  )
}
