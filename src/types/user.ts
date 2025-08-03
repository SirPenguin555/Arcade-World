import { Database } from './database'

export type UserProfile = Database['public']['Tables']['profiles']['Row']

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  soundEnabled: boolean
  musicEnabled: boolean
  notifications: boolean
}

export type UserStats = Database['public']['Tables']['user_stats']['Row']

export interface GameStats {
  gameId: string
  gamesPlayed: number
  bestScore: number
  averageScore: number
  totalScore: number
  completionRate: number
  fastestTime?: number
  longestStreak: number
}

export interface Achievement {
  id: string
  unlockedAt: string
  progress?: number
  maxProgress?: number
}

// Auth-related types
export interface AuthUser {
  id: string
  email: string | null
  phone: string | null
  emailVerified: boolean
  isAnonymous: boolean
}

export interface AuthState {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}