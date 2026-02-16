import { useState } from 'react'
import { X, DollarSign, Tag, Send } from 'lucide-react'

export default function OfferModal({ isOpen, onClose, onSubmit, listingPrice, listingTitle }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const presets = [
    { label: '10% off', value: Math.floor(listingPrice * 0.9) },
    { label: '25% off', value: Math.floor(listingPrice * 0.75) },
    { label: '50% off', value: Math.floor(listingPrice * 0.5) },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const offerAmount = parseFloat(amount)

    if (!offerAmount || isNaN(offerAmount)) {
      setError('Enter a valid amount')
      return
    }
    if (offerAmount <= 0) {
      setError('Offer must be greater than $0')
      return
    }
    if (offerAmount >= listingPrice) {
      setError(`Offer must be less than the listing price ($${listingPrice})`)
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(offerAmount)
    } catch (err) {
      setError(err.message || 'Failed to submit offer')
    } finally {
      setSubmitting(false)
    }
  }

  const savings = amount ? Math.round((1 - parseFloat(amount) / listingPrice) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl shadow-violet-500/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Make an Offer</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{listingTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5">
          {/* Current Price */}
          <div className="flex items-center justify-between mb-5 p-3 bg-slate-800/50 rounded-lg">
            <span className="text-sm text-slate-400">Listing price</span>
            <span className="text-lg font-bold text-white">${listingPrice}</span>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Your offer</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError('') }}
                placeholder="0.00"
                className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-lg font-semibold placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                autoFocus
              />
              {amount && parseFloat(amount) > 0 && parseFloat(amount) < listingPrice && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                  {savings}% off
                </div>
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex gap-2 mb-5">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => { setAmount(String(preset.value)); setError('') }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  parseFloat(amount) === preset.value
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !amount}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Offer{amount && parseFloat(amount) > 0 ? ` — $${parseFloat(amount).toFixed(2)}` : ''}
              </>
            )}
          </button>

          <p className="text-xs text-slate-600 text-center mt-3">
            The seller can accept, decline, or counter your offer
          </p>
        </form>
      </div>
    </div>
  )
}
