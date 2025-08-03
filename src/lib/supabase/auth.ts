import { supabase } from './client'
import { UserProfile, UserPreferences } from '@/types/user'
import { UsernameService } from './usernames'
import type { Json } from '@/types/database'

interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    avatar_url?: string
    full_name?: string
    [key: string]: unknown
  }
}

export class AuthService {
  // Email/Password Registration
  static async registerWithEmail(email: string, password: string, displayName: string, username: string) {
    try {
      // First check if username is available
      const isUsernameAvailable = await UsernameService.isUsernameAvailable(username)
      if (!isUsernameAvailable) {
        throw new Error('Username is already taken or invalid')
      }

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            username: username
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No user returned from signup')

      // Reserve the username
      const usernameReserved = await UsernameService.reserveUsername(username, authData.user.id)
      if (!usernameReserved) {
        // If username reservation fails, the user account is already created
        // We should clean up or handle this gracefully
        throw new Error('Username became unavailable during registration')
      }

      // Create user profile in profiles table
      await this.createUserProfile(authData.user, false, username, displayName)

      return { user: authData.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  // Email/Password Sign In
  static async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  // Google Sign In
  static async signInWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      return { user: null, error: null } // OAuth redirects, so no immediate user
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  // Anonymous Sign In
  static async signInAnonymously() {
    try {
      const { data, error } = await supabase.auth.signInAnonymously()

      if (error) throw error
      if (!data.user) throw new Error('No user returned from anonymous signin')

      // Generate a guest username
      const guestUsername = `guest${Date.now()}`
      await UsernameService.reserveUsername(guestUsername, data.user.id)

      // Create guest profile
      await this.createUserProfile(data.user, true, guestUsername, 'Guest Player')

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  // Convert anonymous account to permanent account
  static async linkAnonymousAccount(email: string, password: string, displayName: string, username: string) {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser || !currentUser.is_anonymous) {
        throw new Error('No anonymous user to link')
      }

      // Check if username is available (different from current guest username)
      const currentProfile = await this.getUserProfile(currentUser.id)
      if (currentProfile?.username !== username) {
        const isUsernameAvailable = await UsernameService.isUsernameAvailable(username)
        if (!isUsernameAvailable) {
          throw new Error('Username is already taken or invalid')
        }
      }

      // Update the user's email and password
      const { data, error } = await supabase.auth.updateUser({
        email,
        password,
        data: {
          display_name: displayName,
          username: username
        }
      })

      if (error) throw error

      // Update username if changed
      if (currentProfile?.username !== username) {
        await UsernameService.reserveUsername(username, currentUser.id)
      }

      // Update user profile in database
      await this.updateUserProfile(currentUser.id, {
        display_name: displayName,
        email,
        username,
        is_guest: false,
        account_linked_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      return { user: data.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  // Sign Out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  // Create User Profile
  static async createUserProfile(user: AuthUser, isGuest = false, username: string, displayName?: string) {
    const defaultPreferences: UserPreferences = {
      theme: 'dark',
      soundEnabled: true,
      musicEnabled: true,
      notifications: true,
    }

    const userProfile = {
      id: user.id,
      email: user.email,
      display_name: displayName || (isGuest ? 'Guest Player' : 'Player'),
      username,
      photo_url: user.user_metadata?.avatar_url || null,
      is_guest: isGuest,
      points: 100, // Starting points
      tickets: 0,
      level: 1,
      experience: 0,
      unlocked_arcades: ['classic'],
      unlocked_modes: ['freeplay', 'challenges'],
      preferences: defaultPreferences as unknown as Json,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
      account_linked_at: null,
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(userProfile)

    if (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }

  // Update User Profile
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  // Get User Profile
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error fetching user profile:', error)
      throw error
    }

    return data
  }

  // Get current session
  static async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }

  // Get current user
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}