import { Timestamp, FieldValue } from 'firebase/firestore'

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isGuest: boolean
  
  // Game Progress
  points: number
  tickets: number
  level: number
  experience: number
  
  // Unlocked Content
  unlockedArcades: string[]
  unlockedModes: string[]
  
  // Customization
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    soundEnabled: boolean
    musicEnabled: boolean
    notifications: boolean
  }
  
  // Timestamps
  createdAt: Timestamp | FieldValue | null
  updatedAt: Timestamp | FieldValue | null
  lastLoginAt: Timestamp | FieldValue | null
  accountLinkedAt?: Timestamp | FieldValue | null
}

export interface UserStats {
  uid: string
  
  // Overall Stats
  gamesPlayed: number
  totalPlayTime: number // in seconds
  highestStreak: number
  
  // Currency Stats
  totalPointsEarned: number
  totalTicketsEarned: number
  totalPrizesWon: number
  
  // Game-specific stats (dynamic based on games)
  gameStats: Record<string, GameStats>
  
  // Achievement progress
  achievements: Achievement[]
  
  updatedAt: Timestamp | FieldValue | null
}

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
  unlockedAt: Timestamp | FieldValue | null
  progress?: number
  maxProgress?: number
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  soundEnabled: boolean
  musicEnabled: boolean
  notifications: boolean
  controlScheme: 'touch' | 'keyboard' | 'auto'
}

// Auth-related types
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isAnonymous: boolean
  emailVerified: boolean
}

export interface AuthState {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}