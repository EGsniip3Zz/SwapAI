import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import {
  Star, ExternalLink, ArrowLeft, Globe, Code,
  MessageSquare, Shield, Clock, Users, Zap
} from 'lucide-react'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

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
            avatar_url
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
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-medium">{listing.rating || '5.0'}</span>
                  <span className="text-slate-500">({listing.review_count || 0} reviews)</span>
                </div>
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
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm transition-all">
                <MessageSquare className="w-4 h-4" />
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
