import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Star, Send } from 'lucide-react'

export default function Reviews({ listingId, sellerId }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)

  useEffect(() => {
    fetchReviews()
    if (user) checkEligibility()
  }, [listingId, user])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, reviewer:profiles!reviewer_id(id, full_name)')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkEligibility = async () => {
    try {
      // Check if user purchased this listing
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('listing_id', listingId)
        .single()

      setHasPurchased(!!purchase)

      // Check if already reviewed
      const { data: review } = await supabase
        .from('reviews')
        .select('id')
        .eq('reviewer_id', user.id)
        .eq('listing_id', listingId)
        .single()

      setHasReviewed(!!review)
    } catch {
      // No purchase or review found
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating || !comment.trim()) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from('reviews').insert({
        listing_id: listingId,
        reviewer_id: user.id,
        seller_id: sellerId,
        rating,
        comment: comment.trim()
      })

      if (error) throw error

      setComment('')
      setRating(0)
      setShowForm(false)
      setHasReviewed(true)
      fetchReviews()
    } catch (err) {
      console.error('Error submitting review:', err)
      alert('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const StarRating = ({ value, size = 'w-4 h-4', interactive = false }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => setRating(star) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          disabled={!interactive}
        >
          <Star
            className={`${size} ${
              star <= (interactive ? (hoverRating || rating) : value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-700'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Reviews</h2>
          {avgRating && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(avgRating)} />
              <span className="text-sm text-slate-400">{avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>

        {/* Write Review Button */}
        {user && hasPurchased && !hasReviewed && user.id !== sellerId && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white text-sm font-medium transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
            <StarRating value={rating} size="w-6 h-6" interactive />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience with this tool..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting || !rating || !comment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/4 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-full mb-1" />
              <div className="h-3 bg-slate-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-4">No reviews yet. Be the first to review this tool!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-slate-800 last:border-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {review.reviewer?.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{review.reviewer?.full_name || 'Anonymous'}</p>
                    <StarRating value={review.rating} size="w-3 h-3" />
                  </div>
                </div>
                <span className="text-xs text-slate-600">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-400 ml-11">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
