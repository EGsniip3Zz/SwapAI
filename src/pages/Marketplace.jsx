import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ListingCard from '../components/ListingCard'
import { Search, Filter, ChevronDown } from 'lucide-react'

const categories = [
  { value: 'all', label: 'All Categories', emoji: '🔥' },
  { value: 'text-nlp', label: 'Text & NLP', emoji: '📝' },
  { value: 'image-gen', label: 'Image Gen', emoji: '🎨' },
  { value: 'voice-audio', label: 'Voice & Audio', emoji: '🎙️' },
  { value: 'video', label: 'Video', emoji: '🎬' },
  { value: 'data-analysis', label: 'Data Analysis', emoji: '📊' },
  { value: 'automation', label: 'Automation', emoji: '⚡' },
  { value: 'other', label: 'Other', emoji: '🤖' },
]

const priceFilters = [
  { value: 'all', label: 'Any Price' },
  { value: 'free', label: 'Free' },
  { value: 'under-50', label: 'Under $50' },
  { value: 'under-100', label: 'Under $100' },
  { value: 'over-100', label: '$100+' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

export default function Marketplace() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [selectedSort, setSelectedSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [selectedCategory, selectedPrice, selectedSort])

  const fetchListings = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          profiles (
            id,
            full_name
          )
        `)
        .eq('status', 'approved')

      // Category filter
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      // Price filter
      if (selectedPrice === 'free') {
        query = query.eq('price_type', 'free')
      } else if (selectedPrice === 'under-50') {
        query = query.lt('price', 50).neq('price_type', 'free')
      } else if (selectedPrice === 'under-100') {
        query = query.lt('price', 100).neq('price_type', 'free')
      } else if (selectedPrice === 'over-100') {
        query = query.gte('price', 100)
      }

      // Sort
      if (selectedSort === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else if (selectedSort === 'oldest') {
        query = query.order('created_at', { ascending: true })
      } else if (selectedSort === 'price-low') {
        query = query.order('price', { ascending: true })
      } else if (selectedSort === 'price-high') {
        query = query.order('price', { ascending: false })
      } else if (selectedSort === 'rating') {
        query = query.order('rating', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter by search query (client-side for simplicity)
  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Insert ad placeholders every 6 listings
  const listingsWithAds = []
  filteredListings.forEach((listing, index) => {
    listingsWithAds.push(listing)
    if ((index + 1) % 6 === 0) {
      listingsWithAds.push({ id: `ad-${index}`, isAd: true })
    }
  })

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">AI Tools Marketplace</h1>
          <p className="text-slate-400">Discover and deploy production-ready AI tools</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI tools..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-slate-300"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-wrap gap-4">
              {/* Category Pills */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat.value
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      <span className="mr-1">{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {priceFilters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-400 text-sm">
            {filteredListings.length} {filteredListings.length === 1 ? 'tool' : 'tools'} found
          </p>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-slate-800" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No tools found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listingsWithAds.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                isAd={item.isAd}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
