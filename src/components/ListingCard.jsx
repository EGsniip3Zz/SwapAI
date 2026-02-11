import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

export default function ListingCard({ listing, isAd = false }) {
  const categoryColors = {
    'text-nlp': 'bg-blue-500/20 text-blue-400',
    'image-gen': 'bg-purple-500/20 text-purple-400',
    'voice-audio': 'bg-green-500/20 text-green-400',
    'video': 'bg-red-500/20 text-red-400',
    'data-analysis': 'bg-yellow-500/20 text-yellow-400',
    'automation': 'bg-orange-500/20 text-orange-400',
    'other': 'bg-slate-500/20 text-slate-400',
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

  if (isAd) {
    return (
      <div className="relative bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden group hover:border-slate-600 transition-all duration-300">
        <div className="absolute top-3 right-3 px-2 py-1 bg-slate-700 rounded text-xs text-slate-400">
          Sponsored
        </div>
        <div className="aspect-video bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
          <span className="text-slate-500 text-sm">Ad Placement</span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white mb-1">Featured Tool</h3>
          <p className="text-sm text-slate-400 line-clamp-2">Premium ad space for featured listings</p>
        </div>
      </div>
    )
  }

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden group hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
    >
      {/* Image */}
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

        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[listing.category] || categoryColors.other}`}>
          {categoryLabels[listing.category] || 'Other'}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-slate-900/90 backdrop-blur rounded-full">
          <span className="text-white font-semibold text-sm">
            {listing.price_type === 'free' ? 'Free' :
             listing.price_type === 'contact' ? 'Contact' :
             `$${listing.price}${listing.price_type === 'monthly' ? '/mo' : ''}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-1">
            {listing.title}
          </h3>
          <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <p className="text-sm text-slate-400 line-clamp-2 mb-3">
          {listing.short_description}
        </p>

        {/* Seller */}
        <span className="text-xs text-slate-500">
          by {listing.profiles?.full_name || 'Anonymous'}
        </span>
      </div>
    </Link>
  )
}
