import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { supabase } from '@/lib/supabase/client'
import { AuthState, UserProfile } from '@/types/user'
import { AuthService } from '@/lib/supabase/auth'
import type { User } from '@supabase/supabase-js'

interface AuthStore extends AuthState {
  // Actions
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, displayName: string, username: string) => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signInAnonymously: () => Promise<{ success: boolean; error?: string }>
  linkAccount: (email: string, password: string, displayName: string, username: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  clearError: () => void
  
  // Internal actions
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    // Initial state
    user: null,
    profile: null,
    loading: true,
    error: null,

    // Actions
    signIn: async (email: string, password: string) => {
      set({ loading: true, error: null })
      const { error } = await AuthService.signInWithEmail(email, password)
      
      if (error) {
        set({ loading: false, error: error.message })
        return { success: false, error: error.message }
      }
      
      return { success: true }
    },

    signUp: async (email: string, password: string, displayName: string, username: string) => {
      set({ loading: true, error: null })
      const { error } = await AuthService.registerWithEmail(email, password, displayName, username)
      
      if (error) {
        set({ loading: false, error: error.message })
        return { success: false, error: error.message }
      }
      
      return { success: true }
    },

    signInWithGoogle: async () => {
      set({ loading: true, error: null })
      const { error } = await AuthService.signInWithGoogle()
      
      if (error) {
        set({ loading: false, error: error.message })
        return { success: false, error: error.message }
      }
      
      return { success: true }
    },

    signInAnonymously: async () => {
      set({ loading: true, error: null })
      const { error } = await AuthService.signInAnonymously()
      
      if (error) {
        set({ loading: false, error: error.message })
        return { success: false, error: error.message }
      }
      
      return { success: true }
    },

    linkAccount: async (email: string, password: string, displayName: string, username: string) => {
      set({ loading: true, error: null })
      const { error } = await AuthService.linkAnonymousAccount(email, password, displayName, username)
      
      if (error) {
        set({ loading: false, error: error.message })
        return { success: false, error: error.message }
      }
      
      return { success: true }
    },

    signOut: async () => {
      set({ loading: true })
      await AuthService.signOut()
      set({ user: null, profile: null, loading: false, error: null })
    },

    clearError: () => set({ error: null }),

    // Internal actions
    setUser: (user) => set({ user: user ? {
      id: user.id,
      email: user.email || null,
      phone: user.phone || null,
      emailVerified: !!user.email_confirmed_at,
      isAnonymous: user.is_anonymous || false,
    } : null }),
    
    setProfile: (profile) => set({ profile }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  }))
)

// Initialize auth state listener
let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null

export const initializeAuth = () => {
  // Clean up existing listeners
  if (authSubscription) {
    authSubscription.data.subscription.unsubscribe()
  }

  // Listen to auth state changes
  authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
    const { setUser, setLoading, setProfile } = useAuthStore.getState()
    
    setUser(session?.user || null)
    
    if (session?.user) {
      // Check if user has a profile, create if needed
      try {
        let profile = await AuthService.getUserProfile(session.user.id)
        
        if (!profile && event === 'SIGNED_IN') {
          // Handle OAuth sign-ins where profile might not exist
          const userData = session.user.user_metadata
          const email = session.user.email
          
          if (email && !session.user.is_anonymous) {
            // Generate a username from email or display name
            const baseUsername = (userData?.full_name || email.split('@')[0])
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '') || 'player'
            
            let username = baseUsername
            let counter = 1
            
            // Find available username
            const { UsernameService } = await import('@/lib/supabase/usernames')
            while (!(await UsernameService.isUsernameAvailable(username))) {
              username = `${baseUsername}${counter}`
              counter++
              if (counter > 999) {
                username = `player${Date.now()}`
                break
              }
            }
            
            // Reserve username and create profile
            await UsernameService.reserveUsername(username, session.user.id)
            await AuthService.createUserProfile(
              session.user, 
              false, 
              username, 
              userData?.full_name || 'Player'
            )
            
            // Fetch the newly created profile
            profile = await AuthService.getUserProfile(session.user.id)
          }
        }
        
        setProfile(profile)
        setLoading(false)
        
      } catch (error) {
        console.error('Error handling auth state change:', error)
        setLoading(false)
      }
    } else {
      setProfile(null)
      setLoading(false)
    }
  })
}

// Clean up function
export const cleanupAuth = () => {
  if (authSubscription) {
    authSubscription.data.subscription.unsubscribe()
  }
}