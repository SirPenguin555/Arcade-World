import { supabase } from './client'

// Reserved usernames that cannot be used
const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'user', 'guest', 'player',
  'arcade', 'world', 'game', 'support', 'help', 'api',
  'www', 'mail', 'email', 'info', 'contact', 'about',
  'null', 'undefined', 'true', 'false', 'system'
]

export class UsernameService {
  // Check if username is available
  static async isUsernameAvailable(username: string): Promise<boolean> {
    // Basic validation
    if (!this.isValidUsername(username)) {
      return false
    }

    // Check reserved usernames
    if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
      return false
    }

    try {
      // Check if username exists in Supabase
      const { error } = await supabase
        .from('usernames')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      if (error && error.code === 'PGRST116') {
        // No rows returned - username is available
        return true
      }

      if (error) {
        console.error('Error checking username availability:', error)
        return false
      }

      // Username exists - not available
      return false
    } catch (error) {
      console.error('Error checking username availability:', error)
      return false
    }
  }

  // Reserve a username for a user
  static async reserveUsername(username: string, userId: string): Promise<boolean> {
    try {
      const isAvailable = await this.isUsernameAvailable(username)
      if (!isAvailable) {
        return false
      }

      // Insert username record
      const { error } = await supabase
        .from('usernames')
        .insert({
          username: username.toLowerCase(),
          original_username: username, // Keep original casing
          user_id: userId,
          created_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Error reserving username:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error reserving username:', error)
      return false
    }
  }

  // Validate username format
  static isValidUsername(username: string): boolean {
    // Check length (3-20 characters)
    if (username.length < 3 || username.length > 20) {
      return false
    }

    // Check format: alphanumeric, underscores, hyphens only
    // Must start and end with alphanumeric
    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/
    if (!usernameRegex.test(username)) {
      return false
    }

    // No consecutive special characters
    if (username.includes('__') || username.includes('--') || username.includes('_-') || username.includes('-_')) {
      return false
    }

    return true
  }

  // Get username validation error message
  static getValidationError(username: string): string | null {
    if (username.length < 3) {
      return 'Username must be at least 3 characters long'
    }
    
    if (username.length > 20) {
      return 'Username must be no more than 20 characters long'
    }

    if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
      return 'This username is reserved and cannot be used'
    }

    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/
    if (!usernameRegex.test(username)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens. Must start and end with a letter or number.'
    }

    if (username.includes('__') || username.includes('--') || username.includes('_-') || username.includes('-_')) {
      return 'Username cannot contain consecutive special characters'
    }

    return null
  }

  // Generate username suggestions based on display name
  static generateSuggestions(displayName: string, existingUsernames: string[] = []): string[] {
    const base = displayName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 15)

    if (!base) {
      return ['player123', 'gamer456', 'arcade789']
    }

    const suggestions = [
      base,
      `${base}123`,
      `${base}_gamer`,
      `${base}_player`,
      `arcade_${base}`,
      `${base}_${Math.floor(Math.random() * 1000)}`,
    ]

    // Filter out existing usernames and invalid ones
    return suggestions
      .filter(username => 
        this.isValidUsername(username) && 
        !existingUsernames.includes(username.toLowerCase()) &&
        !RESERVED_USERNAMES.includes(username.toLowerCase())
      )
      .slice(0, 3)
  }
}