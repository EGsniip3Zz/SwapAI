import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ListingCard from '../components/ListingCard'
import { Search, Filter, ChevronDown, ArrowRight } from 'lucide-react'

const allCategories = {
  'text-nlp': { label: 'Text & NLP', emoji: '📝' },
  'image-gen': { label: 'Image Gen', emoji: '🎨' },
  'voice-audio': { label: 'Voice & Audio', emoji: '🎙️' },
  'video': { label: 'Video', emoji: '🎬' },
  'data-analysis': { label: 'Data Analysis', emoji: '📊' },
  'automation': { label: 'Automation', emoji: '⚡' },
  'other': { label: 'Other', emoji: '🤖' },
}

const priceFilters = [
  { value: 'all', label: 'Any Price' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
  { value: 'under-100', label: 'Under $100' },
  { value: 'over-1999', label: '$1999+' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

export default function Marketplace() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [selectedSort, setSelectedSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [availableCategories, setAvailableCategories] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    document.title = 'Buy AI Tools & MRR Businesses | SwapAi'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', 'Browse profitable AI chatbots, workflows, SaaS tools and recurring revenue assets for sale. Serious buyers only.')
  }, [])

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
      } else if (selectedPrice === 'paid') {
        query = query.neq('price_type', 'free')
      } else if (selectedPrice === 'under-100') {
        query = query.lt('price', 100).neq('price_type', 'free')
      } else if (selectedPrice === 'over-1999') {
        query = query.gte('price', 1999)
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
      }

      const { data, error } = await query

      if (error) throw error
      setListings(data || [])

      // Get unique categories from all approved listings
      const { data: allListings } = await supabase
        .from('listings')
        .select('category')
        .eq('status', 'approved')

      if (allListings) {
        const uniqueCategories = [...new Set(allListings.map(l => l.category))]
        setAvailableCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter by search query (client-side for simplicity)
  const filteredListings = listings.filter(listing => {
    // Search filter
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.short_description?.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    // Status filter
    if (selectedStatus === 'all') return true

    const now = new Date()
    const createdAt = new Date(listing.created_at)
    const daysSinceCreated = (now - createdAt) / (1000 * 60 * 60 * 24)

    if (selectedStatus === 'new') return daysSinceCreated <= 14
    if (selectedStatus === 'featured') return (listing.purchase_count || 0) >= 3 || (listing.views || 0) >= 50
    if (selectedStatus === 'hot') return (listing.views || 0) >= 20 || (listing.purchase_count || 0) >= 1
    if (selectedStatus === 'sold') return (listing.purchase_count || 0) > 0

    return true
  })

  // Simple listing array (no ads)
  const listingsWithAds = [...filteredListings]

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* For Buyers Banner */}
        <Link to="/for-buyers" className="block mb-6 group">
          <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-fuchsia-600/10 to-violet-600/10 border border-violet-500/20 rounded-xl hover:border-violet-500/40 transition-all">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">Serious buyer?</span> Get priority access to vetted AI businesses with proven revenue.
            </p>
            <span className="flex items-center gap-1 text-sm text-violet-400 font-medium flex-shrink-0 ml-4 group-hover:gap-2 transition-all">
              For Buyers <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

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
          <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-3`}>
            {/* Row 1: Category Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span className="mr-1">🔥</span>
                All Categories
              </button>

              {availableCategories.map((catValue) => {
                const cat = allCategories[catValue]
                if (!cat) return null
                return (
                  <button
                    key={catValue}
                    onClick={() => setSelectedCategory(catValue)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === catValue
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <span className="mr-1">{cat.emoji}</span>
                    {cat.label}
                  </button>
                )
              })}
            </div>

            {/* Row 2: Status Tabs + Price + Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'new', label: 'New' },
                  { value: 'featured', label: 'Featured' },
                  { value: 'hot', label: 'Hot' },
                  { value: 'sold', label: 'Sold' },
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedStatus === status.value
                        ? status.value === 'all'
                          ? 'bg-white/10 text-white border border-white/20'
                          : status.value === 'new'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : status.value === 'featured'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : status.value === 'hot'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                        : 'bg-slate-800/50 text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-700'
                    }`}
                  >
                    {status.value === 'new' && '✨ '}
                    {status.value === 'featured' && '⭐ '}
                    {status.value === 'hot' && '🔥 '}
                    {status.value === 'sold' && '✅ '}
                    {status.label}
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-slate-700 hidden sm:block" />

              {/* Price Filter */}
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
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
