import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { User, Package, Settings, Plus, Edit, Trash2, Eye, X, Save, CreditCard, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth()
  const [searchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeStatus, setStripeStatus] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    role: 'buyer'
  })

  useEffect(() => {
    if (user) {
      fetchMyListings()
    }
  }, [user])

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        role: profile.role || 'buyer'
      })

      // Check Stripe account status if seller has connected
      if (profile.stripe_account_id) {
        checkStripeStatus(profile.stripe_account_id)
      }
    }
  }, [profile])

  // Handle Stripe redirect
  useEffect(() => {
    const stripeParam = searchParams.get('stripe')
    const accountId = searchParams.get('account')

    if (stripeParam === 'success' && accountId) {
      // Save the Stripe account ID to profile
      saveStripeAccountId(accountId)
    }
  }, [searchParams])

  const saveStripeAccountId = async (accountId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ stripe_account_id: accountId })
        .eq('id', user.id)

      if (error) throw error

      await refreshProfile()
      setMessage({ type: 'success', text: 'Stripe account connected successfully!' })
    } catch (error) {
      console.error('Error saving Stripe account:', error)
    }
  }

  const checkStripeStatus = async (accountId) => {
    try {
      const response = await fetch(`${API_URL}/api/stripe/account-status/${accountId}`)
      const data = await response.json()
      setStripeStatus(data)
    } catch (error) {
      console.error('Error checking Stripe status:', error)
    }
  }

  const connectStripe = async () => {
    setStripeLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/stripe/create-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          userId: user.id
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Redirect to Stripe onboarding
      window.location.href = data.url
    } catch (error) {
      console.error('Error connecting Stripe:', error)
      setMessage({ type: 'error', text: 'Failed to connect Stripe. Make sure the server is running.' })
    } finally {
      setStripeLoading(false)
    }
  }

  const continueStripeOnboarding = async () => {
    setStripeLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/stripe/refresh-account-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: profile.stripe_account_id
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      window.location.href = data.url
    } catch (error) {
      console.error('Error continuing onboarding:', error)
      setMessage({ type: 'error', text: 'Failed to continue onboarding.' })
    } finally {
      setStripeLoading(false)
    }
  }

  const fetchMyListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteListing = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)

      if (error) throw error
      setListings(listings.filter(l => l.id !== id))
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Error deleting listing')
    }
  }

  const openSettings = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        role: profile.role || 'buyer'
      })
    }
    setShowSettings(true)
    setMessage({ type: '', text: '' })
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          role: formData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      await refreshProfile()
      setMessage({ type: 'success', text: 'Profile updated successfully!' })

      setTimeout(() => {
        setShowSettings(false)
      }, 1000)

    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to save profile' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-slate-400">Manage your account and listings</p>
        </div>

        {/* Success/Error Messages */}
        {message.text && !showSettings && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{profile?.full_name || 'User'}</h2>
                <p className="text-slate-400">{user?.email}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  profile?.role === 'admin' ? 'bg-fuchsia-500/20 text-fuchsia-400' :
                  profile?.role === 'seller' ? 'bg-violet-500/20 text-violet-400' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1) || 'Buyer'}
                </span>
              </div>
            </div>
            <button
              onClick={openSettings}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stripe Connect Card (for sellers) */}
        {(profile?.role === 'seller' || profile?.role === 'admin') && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">Payment Setup</h2>
            </div>

            {!profile?.stripe_account_id ? (
              <div>
                <p className="text-slate-400 mb-4">
                  Connect your Stripe account to receive payments from your sales. SwapAI takes a 10% platform fee, and you keep 90%.
                </p>
                <button
                  onClick={connectStripe}
                  disabled={stripeLoading}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {stripeLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Connect with Stripe
                    </>
                  )}
                </button>
              </div>
            ) : stripeStatus?.chargesEnabled && stripeStatus?.payoutsEnabled ? (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">Stripe account connected and ready to receive payments</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400">Stripe setup incomplete - please finish onboarding</span>
                </div>
                <button
                  onClick={continueStripeOnboarding}
                  disabled={stripeLoading}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {stripeLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Continue Setup
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Link
            to="/marketplace"
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-violet-500/50 transition-all group"
          >
            <Package className="w-8 h-8 text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-white">Browse Marketplace</h3>
            <p className="text-sm text-slate-500">Discover AI tools</p>
          </Link>

          {(profile?.role === 'seller' || profile?.role === 'admin') && (
            <Link
              to="/sell"
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-violet-500/50 transition-all group"
            >
              <Plus className="w-8 h-8 text-fuchsia-400 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-white">List a Tool</h3>
              <p className="text-sm text-slate-500">Sell your AI tool</p>
            </Link>
          )}

          <Link
            to="/support"
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-violet-500/50 transition-all group"
          >
            <Settings className="w-8 h-8 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-white">Get Help</h3>
            <p className="text-sm text-slate-500">Contact support</p>
          </Link>
        </div>

        {/* My Listings (for sellers) */}
        {(profile?.role === 'seller' || profile?.role === 'admin') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">My Listings</h2>
              <Link
                to="/sell"
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-sm font-medium text-white hover:from-violet-500 hover:to-fuchsia-500 transition-all"
              >
                + New Listing
              </Link>
            </div>

            {loading ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto" />
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">You haven't listed any tools yet</p>
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Listing
                </Link>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Tool</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Price</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
                      <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link to={`/edit-listing/${listing.id}`} className="p-2 text-slate-400 hover:text-violet-400 transition-colors" title="Edit"><Edit className="w-4 h-4" /></Link><Link to={`/listing/${listing.id}`} className="flex items-center gap-3 hover:opacity-80"><span className="text-2xl">{listing.emoji || '🤖'}</span>
                            <div>
                              <p className="font-medium text-white">{listing.title}</p>
                              <p className="text-xs text-slate-500">{listing.category}</p></Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {listing.price_type === 'free' ? 'Free' :
                           listing.price_type === 'contact' ? 'Contact' :
                           `$${listing.price}${listing.price_type === 'monthly' ? '/mo' : ''}`}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            listing.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                            listing.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {listing.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/edit-listing/${listing.id}`} className="p-2 text-slate-400 hover:text-violet-400 transition-colors" title="Edit"><Edit className="w-4 h-4" /></Link><Link to={`/listing/${listing.id}`}
                              className="p-2 text-slate-400 hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => deleteListing(listing.id)}
                              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSaveProfile}>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {formData.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Account Type
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="buyer">Buyer - Browse and purchase tools</option>
                    <option value="seller">Seller - List and sell your tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
