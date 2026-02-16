import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ListingsCarousel() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [visibleCount, setVisibleCount] = useState(4)
  const intervalRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    fetchListings()
    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  const updateVisibleCount = () => {
    if (window.innerWidth < 640) setVisibleCount(1)
    else if (window.innerWidth < 1024) setVisibleCount(2)
    else setVisibleCount(4)
  }

  // Auto-rotate
  useEffect(() => {
    if (listings.length === 0 || isPaused) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const max = Math.max(0, listings.length - visibleCount)
        return prev >= max ? 0 : prev + 1
      })
    }, 5000)

    return () => clearInterval(intervalRef.current)
  }, [listings, isPaused, visibleCount])

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, profiles(id, full_name)')
        .eq('status', 'approved')
        .order('purchase_count', { ascending: false })
        .limit(12)

      if (error) throw error
      setListings(data || [])
    } catch (err) {
      console.error('Error fetching carousel listings:', err)
    } finally {
      setLoading(false)
    }
  }

  const maxIndex = Math.max(0, listings.length - visibleCount)

  const goNext = () => setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  const goPrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0))

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-slate-800 rounded-xl mb-3" />
            <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (listings.length === 0) return null

  // Calculate the percentage each card takes up
  const cardPercent = 100 / visibleCount
  const gapPx = 16

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={goPrev}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-full flex items-center justify-center text-white transition-all shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {currentIndex < maxIndex && (
        <button
          onClick={goNext}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-full flex items-center justify-center text-white transition-all shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Carousel Track */}
      <div className="overflow-hidden" ref={trackRef}>
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            gap: `${gapPx}px`,
            transform: `translateX(calc(-${currentIndex} * (${cardPercent}% + ${gapPx - (gapPx / visibleCount)}px)))`,
          }}
        >
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex-shrink-0"
              style={{ width: `calc(${cardPercent}% - ${gapPx * (visibleCount - 1) / visibleCount}px)` }}
            >
              <Link
                to={`/listing/${listing.id}`}
                className="block bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden group hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
              >
                <div className="aspect-video bg-slate-800 relative overflow-hidden">
                  {listing.image_url ? (
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20">
                      <span className="text-4xl">{listing.emoji || '🤖'}</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/90 backdrop-blur rounded-full">
                    <span className="text-white font-semibold text-xs">
                      {listing.price_type === 'free' ? 'Free' : `$${listing.price}`}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-white text-sm group-hover:text-violet-400 transition-colors line-clamp-1 mb-1">
                    {listing.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {listing.short_description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-6 bg-violet-500'
                  : 'w-1.5 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
