import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Star, ShoppingBag, Eye, Calendar, Shield } from 'lucide-react'
import ListingCard from '../components/ListingCard'

export default function SellerProfile() {
  const { id } = useParams()
  const [seller, setSeller] = useState(null)
  const [listings, setListings] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalSales: 0, totalViews: 0, avgRating: 0, reviewCount: 0 })

  useEffect(() => {
    document.title = 'Seller Profile | SwapAi'
    fetchSellerData()
  }, [id])

  const fetchSellerData = async () => {
    try {
      // Fetch seller profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, created_at')
        .eq('id', id)
        .single()

      if (profileError) throw profileError
      setSeller(profile)
      document.title = `${profile.full_name} — Seller on SwapAi`

      // Fetch seller's approved listings
      const { data: sellerListings, error: listingsError } = await supabase
        .from('listings')
        .select('*, profiles(id, full_name)')
        .eq('profiles.id', id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (listingsError) throw listingsError

      // Filter to only this seller's listings (supabase join filter quirk)
      const filtered = (sellerListings || []).filter(l => l.profiles?.id === id)
      setListings(filtered)

      // Calculate stats
      const totalSales = filtered.reduce((sum, l) => sum + (l.purchase_count || 0), 0)
      const totalViews = filtered.reduce((sum, l) => sum + (l.views || 0), 0)

      // Fetch all reviews for this seller
      const { data: sellerReviews } = await supabase
        .from('reviews')
        .select('*, reviewer:profiles!reviewer_id(id, full_name), listing:listings(id, title, emoji)')
        .eq('seller_id', id)
        .order('created_at', { ascending: false })
        .limit(20)

      const revs = sellerReviews || []
      setReviews(revs)

      const avgRating = revs.length > 0
        ? (revs.reduce((sum, r) => sum + r.rating, 0) / revs.length).toFixed(1)
        : 0

      setStats({ totalSales, totalViews, avgRating, reviewCount: revs.length })
    } catch (err) {
      console.error('Error fetching seller data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-slate-800 rounded-full" />
              <div>
                <div className="h-6 bg-slate-800 rounded w-48 mb-2" />
                <div className="h-4 bg-slate-800 rounded w-32" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-800 rounded-xl" />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Seller not found</h1>
          <Link to="/marketplace" className="text-violet-400 hover:text-violet-300">Back to Marketplace</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back */}
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        {/* Seller Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {seller.full_name?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{seller.full_name}</h1>
                <Shield className="w-5 h-5 text-emerald-400" title="Verified Seller" />
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Member since {new Date(seller.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{listings.length}</div>
                  <div className="text-xs text-slate-500">Listings</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{stats.totalSales}</div>
                  <div className="text-xs text-slate-500">Sales</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-lg font-bold text-white">{stats.avgRating || '—'}</span>
                  </div>
                  <div className="text-xs text-slate-500">{stats.reviewCount} review{stats.reviewCount !== 1 ? 's' : ''}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{stats.totalViews.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">Views</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">{seller.full_name}'s Listings</h2>
          {listings.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No listings yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Recent Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {review.reviewer?.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{review.reviewer?.full_name || 'Anonymous'}</p>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {review.listing && (
                        <Link to={`/listing/${review.listing.id}`} className="text-xs text-violet-400 hover:underline">
                          {review.listing.emoji} {review.listing.title}
                        </Link>
                      )}
                      <p className="text-xs text-slate-600">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
