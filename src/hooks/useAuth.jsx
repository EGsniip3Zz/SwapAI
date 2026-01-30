import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase, supabaseUrl, supabaseAnonKey } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const fetchingRef = useRef(false)

  const fetchProfile = useCallback(async (userId, accessToken = null) => {
    // Prevent duplicate fetches
    if (fetchingRef.current) {
      console.log('Already fetching, skipping...')
      return
    }
    fetchingRef.current = true

    console.log('fetchProfile called for:', userId)
    console.log('Fetching profile via REST API...')

    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=*`,
        {
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${accessToken || supabaseAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('Response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()
      console.log('REST API fetch result:', data)

      if (data && data[0]) {
        setProfile(data[0])
        console.log('Profile set to:', data[0])
      } else {
        console.log('No profile found')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      // Get fresh token
      const { data: { session } } = await supabase.auth.getSession()
      await fetchProfile(user.id, session?.access_token)
    }
  }, [user?.id, fetchProfile])

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      console.log('Initializing auth...')
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        console.log('Got session:', !!session, 'user:', session?.user?.id)

        if (error) {
          console.error('Error getting session:', error)
          if (mounted) setLoading(false)
          return
        }

        if (session?.user && mounted) {
          setUser(session.user)
          // Pass the access token directly, don't call getSession again
          await fetchProfile(session.user.id, session.access_token)
        } else if (mounted) {
          console.log('No session found')
          setLoading(false)
        }
      } catch (err) {
        console.error('Initialize error:', err)
        if (mounted) setLoading(false)
      }
    }

    initialize()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, 'has session:', !!session)

      if (!mounted) return

      if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }

      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        // Pass the access token directly from the event
        await fetchProfile(session.user.id, session.access_token)
      }

      // Handle INITIAL_SESSION event (fired on page load)
      if (event === 'INITIAL_SESSION' && session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id, session.access_token)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signUp = async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
    }
    return { error }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    isAdmin: profile?.role === 'admin',
    isSeller: profile?.role === 'seller' || profile?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
