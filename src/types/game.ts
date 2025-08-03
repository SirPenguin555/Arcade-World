export interface Game {
  id: string
  name: string
  description: string
  category: string
  arcade: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  
  // Game assets
  thumbnail: string
  icon: string
  
  // Gameplay
  basePointsPerPlay: number
  maxScore: number
  hasTimeLimit: boolean
  timeLimit?: number // in seconds
  
  // Requirements
  requiredLevel: number
  requiredArcade: string
  
  // Metadata
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GameSession {
  id: string
  userId: string
  gameId: string
  
  // Session data
  score: number
  duration: number // in seconds
  pointsEarned: number
  ticketsEarned: number
  
  // Game-specific data
  gameData: Record<string, unknown>
  
  // Timestamps
  startedAt: string
  endedAt: string
}

export interface GameConfig {
  id: string
  settings: Record<string, unknown>
  controls: GameControls
  scoring: ScoringConfig
}

export interface GameControls {
  type: 'touch' | 'keyboard' | 'mouse'
  mappings: Record<string, string>
}

export interface ScoringConfig {
  basePoints: number
  multipliers: Record<string, number>
  bonuses: Record<string, number>
}