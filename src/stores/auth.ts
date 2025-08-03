import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { User, onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config'
import { AuthState, UserProfile } from '@/types/user'
import { AuthService } from '@/lib/firebase/auth'

interface AuthStore extends AuthState {
  // Actions
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signInAnonymously: () => Promise<{ success: boolean; error?: string }>
  linkAccount: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>
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

    signUp: async (email: string, password: string, displayName: string) => {
      set({ loading: true, error: null })
      const { error } = await AuthService.registerWithEmail(email, password, displayName)
      
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

    linkAccount: async (email: string, password: string, displayName: string) => {
      set({ loading: true, error: null })
      const { error } = await AuthService.linkAnonymousAccount(email, password, displayName)
      
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
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous,
      emailVerified: user.emailVerified,
    } : null }),
    
    setProfile: (profile) => set({ profile }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  }))
)

// Initialize auth state listener
let authUnsubscribe: (() => void) | null = null
let profileUnsubscribe: (() => void) | null = null

export const initializeAuth = () => {
  // Clean up existing listeners
  if (authUnsubscribe) authUnsubscribe()
  if (profileUnsubscribe) profileUnsubscribe()

  // Listen to auth state changes
  authUnsubscribe = onAuthStateChanged(auth, (user) => {
    const { setUser, setLoading, setProfile } = useAuthStore.getState()
    
    setUser(user)
    
    if (user) {
      // Listen to user profile changes
      profileUnsubscribe = onSnapshot(
        doc(db, 'users', user.uid),
        (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile)
          } else {
            setProfile(null)
          }
          setLoading(false)
        },
        (error) => {
          console.error('Profile listener error:', error)
          setLoading(false)
        }
      )
    } else {
      // No user, clean up profile listener
      if (profileUnsubscribe) {
        profileUnsubscribe()
        profileUnsubscribe = null
      }
      setProfile(null)
      setLoading(false)
    }
  })
}

// Clean up function
export const cleanupAuth = () => {
  if (authUnsubscribe) authUnsubscribe()
  if (profileUnsubscribe) profileUnsubscribe()
}