import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Zap, Menu, X, MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const { user, profile, signOut, isAdmin, isSeller } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    const fetchUnread = async () => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('read', false)

        if (!error && count !== null) {
          setUnreadCount(count)
        }
      } catch (err) {
        console.log('Error fetching unread count:', err)
      }
    }

    fetchUnread()

    // Poll every 30 seconds for new messages
    const interval = setInterval(fetchUnread, 30000)

    // Also subscribe to realtime for instant updates
    const channel = supabase
      .channel('navbar-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, () => {
        fetchUnread()
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, () => {
        fetchUnread()
      })
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text-simple">SwapAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Home
            </Link>
            <Link to="/marketplace" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Marketplace
            </Link>
            {isSeller && (
              <Link to="/sell" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                Sell a Tool
              </Link>
            )}
            <Link to="/about" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              About
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors text-sm font-medium">
                Admin
              </Link>
            )}
            {user && (
              <Link to="/messages" className="relative text-slate-300 hover:text-white transition-colors text-sm font-medium">
                <MessageSquare className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
            {user && (
              <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                Profile
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm">
                  {profile?.full_name || user.email}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-500/25"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-slate-300 hover:text-white transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/marketplace" className="text-slate-300 hover:text-white transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Marketplace
              </Link>
              {isSeller && (
                <Link to="/sell" className="text-slate-300 hover:text-white transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Sell a Tool
                </Link>
              )}
              <Link to="/about" className="text-slate-300 hover:text-white transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </Link>
              )}
              {user && (
                <Link to="/messages" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Messages
                  {unreadCount > 0 && (
                    <span className="min-w-[20px] h-[20px] flex items-center justify-center px-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              {user && (
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
              )}
              <div className="pt-4 border-t border-slate-800">
                {user ? (
                  <button
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    className="w-full px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-all duration-200"
                  >
                    Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      className="w-full px-4 py-2 text-center text-sm font-medium text-slate-300 hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-center text-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
