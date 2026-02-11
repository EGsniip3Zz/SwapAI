import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { User, Package, Settings, Plus, Trash2, Eye, Camera, Lock, Save, X, CheckCircle, Edit, MessageSquare, CreditCard, ExternalLink } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth()
  const [searchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [recentMessages, setRecentMessages] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [stripeConnecting, setStripeConnecting] = useState(false)
  const [stripeStatus, setStripeStatus] = useState(null)

  // Edit form states
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      fetchMyListings()
      fetchMessages()
      checkStripeStatus()
    }
  }, [user])

  // Check for Stripe redirect
  useEffect(() => {
    const stripeParam = searchParams.get('stripe')
    const accountId = searchParams.get('account')

    if (stripeParam === 'success' && accountId) {
      // Save Stripe account ID to profile
      saveStripeAccount(accountId)
    } else if (stripeParam === 'refresh') {
      setMessage({ type: 'error', text: 'Stripe setup was not completed. Please try again.' })
    }
  }, [searchParams])

  const checkStripeStatus = async () => {
    if (profile?.stripe_account_id) {
      try {
        const response = await fetch(`${API_URL}/api/stripe/account-status/${profile.stripe_account_id}`)
        const data = await response.json()
        setStripeStatus(data)
      } catch (error) {
        console.error('Error checking Stripe status:', error)
      }
    }
  }

  const saveStripeAccount = async (accountId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ stripe_account_id: accountId })
        .eq('id', user.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Stripe account connected successfully!' })
      refreshProfile()
    } catch (error) {
      console.error('Error saving Stripe account:', error)
      setMessage({ type: 'error', text: 'Error saving Stripe account' })
    }
  }

  const connectStripe = async () => {
    setStripeConnecting(true)
    try {
      const response = await fetch(`${API_URL}/api/stripe/create-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, userId: user.id })
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      window.location.href = data.url
    } catch (error) {
      console.error('Error connecting Stripe:', error)
      setMessage({ type: 'error', text: error.message || 'Error connecting Stripe' })
      setStripeConnecting(false)
    }
  }

  const fetchMessages = async () => {
    try {
      // Get unread count
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false)

      setUnreadMessages(count || 0)

      // Get recent messages
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(full_name), listing:listings(title, emoji)')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      setRecentMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
    }
  }

  useEffect(() => {
    console.log('Profile changed in Dashboard:', profile)
    if (profile && profile.full_name !== undefined) {
      setFullName(profile.full_name || '')
      setRole(profile.role || 'buyer')
      setAvatarUrl(profile.avatar_url || '')
      console.log('Form values set to:', { fullName: profile.full_name, role: profile.role })
    }
  }, [profile])

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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' })
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 2MB' })
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
      setMessage({ type: 'success', text: 'Avatar uploaded! Click Save to apply.' })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setMessage({ type: 'error', text: 'Error uploading avatar. Make sure storage is set up.' })
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    // Don't save if profile hasn't loaded yet
    if (!profile) {
      setMessage({ type: 'error', text: 'Profile not loaded yet. Please wait and try again.' })
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })

    // Use form values, they should be populated from profile
    const updateData = {
      full_name: fullName,
      role: role,
      avatar_url: avatarUrl
    }

    console.log('Saving profile...', { updateData, userId: user.id })

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()

      console.log('Update result:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setMessage({ type: 'success', text: 'Profile updated! Refresh the page to see changes.' })
      setSaving(false)
      setShowSettings(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: error.message || 'Error updating profile' })
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordChange(false)
    } catch (error) {
      console.error('Error changing password:', error)
      setMessage({ type: 'error', text: error.message })
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

        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {avatarUrl || profile?.avatar_url ? (
                <img
                  src={avatarUrl || profile?.avatar_url}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-violet-500"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-white">{profile?.full_name || 'User'}</h2>
                <p className="text-slate-400">{user?.email}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  profile?.role === 'admin' ? 'bg-fuchsia-500/20 text-fuchsia-400' :
                  profile?.role === 'seller' ? 'bg-violet-500/20 text-violet-400' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {profile?.role || 'Buyer'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                if (profile) {
                  setFullName(profile.full_name || '')
                  setRole(profile.role || 'buyer')
                  setAvatarUrl(profile.avatar_url || '')
                }
                setShowSettings(!showSettings)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && profile && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4">Edit Profile</h3>

              {message.text && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                  message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-slate-700" />
                    ) : (
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-slate-500" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition-colors disabled:opacity-50"
                      >
                        <Camera className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                      </button>
                      <p className="text-xs text-slate-500 mt-1">Max 2MB, JPG/PNG</p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Your name"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        role === 'buyer'
                          ? 'bg-violet-500/20 border-violet-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="block text-xl mb-1">🛒</span>
                      <span className="text-sm font-medium">Buyer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('seller')}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        role === 'seller'
                          ? 'bg-fuchsia-500/20 border-fuchsia-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="block text-xl mb-1">🛠️</span>
                      <span className="text-sm font-medium">Seller</span>
                    </button>
                  </div>
                </div>

                {/* Password Change */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  {!showPasswordChange ? (
                    <button
                      onClick={() => setShowPasswordChange(true)}
                      className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition-colors w-full"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="New password"
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Confirm password"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleChangePassword}
                          disabled={saving}
                          className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm text-white transition-colors disabled:opacity-50"
                        >
                          Update Password
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordChange(false)
                            setNewPassword('')
                            setConfirmPassword('')
                          }}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-800">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>

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
            to="/messages"
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-violet-500/50 transition-all group relative"
          >
            <MessageSquare className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-white">Messages</h3>
            <p className="text-sm text-slate-500">View conversations</p>
            {unreadMessages > 0 && (
              <span className="absolute top-3 right-3 bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadMessages}
              </span>
            )}
          </Link>
        </div>

        {/* Stripe Connect (for sellers) */}
        {(profile?.role === 'seller' || profile?.role === 'admin') && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-violet-400" />
              Payment Setup
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              {profile?.stripe_account_id ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Stripe Connected</h3>
                      <p className="text-sm text-slate-400">You can receive card payments (10% platform fee)</p>
                    </div>
                  </div>
                  {stripeStatus && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-slate-400">Charges</p>
                        <p className={stripeStatus.chargesEnabled ? 'text-emerald-400' : 'text-yellow-400'}>
                          {stripeStatus.chargesEnabled ? 'Enabled' : 'Pending'}
                        </p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-slate-400">Payouts</p>
                        <p className={stripeStatus.payoutsEnabled ? 'text-emerald-400' : 'text-yellow-400'}>
                          {stripeStatus.payoutsEnabled ? 'Enabled' : 'Pending'}
                        </p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-slate-400">Details</p>
                        <p className={stripeStatus.detailsSubmitted ? 'text-emerald-400' : 'text-yellow-400'}>
                          {stripeStatus.detailsSubmitted ? 'Complete' : 'Incomplete'}
                        </p>
                      </div>
                    </div>
                  )}
                  {stripeStatus && !stripeStatus.chargesEnabled && (
                    <button
                      onClick={connectStripe}
                      disabled={stripeConnecting}
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm text-white transition-colors disabled:opacity-50"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Complete Stripe Setup
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Connect Stripe</h3>
                      <p className="text-sm text-slate-400">Accept card payments for your listings (10% platform fee)</p>
                    </div>
                  </div>
                  <button
                    onClick={connectStripe}
                    disabled={stripeConnecting}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-medium transition-all disabled:opacity-50"
                  >
                    {stripeConnecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Connect with Stripe
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-500 mt-3">
                    Crypto payments (8.5% fee) are always available via Coinbase Commerce - no setup needed!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Messages */}
        {recentMessages.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-violet-400" />
                Recent Messages
              </h2>
              <Link
                to="/messages"
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                View All
              </Link>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              {recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  to="/messages"
                  className="flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 last:border-0"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {msg.sender?.full_name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white truncate">{msg.sender?.full_name || 'User'}</p>
                      {!msg.read && (
                        <span className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    {msg.listing && (
                      <p className="text-xs text-violet-400 truncate">{msg.listing.emoji} {msg.listing.title}</p>
                    )}
                    <p className="text-sm text-slate-500 truncate">{msg.content}</p>
                  </div>
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

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
                          <Link to={`/listing/${listing.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <span className="text-2xl">{listing.emoji || '🤖'}</span>
                            <div>
                              <p className="font-medium text-white">{listing.title}</p>
                              <p className="text-xs text-slate-500">{listing.category}</p>
                            </div>
                          </Link>
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
                              to={`/listing/${listing.id}`}
                              className="p-2 text-slate-400 hover:text-white transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/edit-listing/${listing.id}`}
                              className="p-2 text-slate-400 hover:text-violet-400 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => deleteListing(listing.id)}
                              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                              title="Delete"
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
    </div>
  )
}
