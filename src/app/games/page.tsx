'use client'

import { useAuthStore } from '@/stores/auth'
import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function GamesPage() {
  const { user, profile, loading } = useAuthStore()

  useEffect(() => {
    // Initialize auth when component mounts
    if (typeof window !== 'undefined') {
      import('@/stores/auth').then(({ initializeAuth }) => {
        initializeAuth()
      })
    }
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted">Loading your arcade...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted">Please sign in to access the arcade games.</p>
          <Button 
            onClick={() => window.location.href = '/auth/signin'}
            className="mt-4"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
          🎮 Arcade World
        </h1>
        <div className="space-y-2">
          <p className="text-xl text-foreground">
            Welcome back, <span className="text-primary font-semibold">{profile?.display_name || 'Player'}!</span>
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted">
            <span>💰 {profile?.points || 0} Points</span>
            <span>🎫 {profile?.tickets || 0} Tickets</span>
            <span>📊 Level {profile?.level || 1}</span>
          </div>
        </div>
      </div>

      {/* Games Grid - Coming Soon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Game Cards Placeholder */}
        {[1, 2, 3, 4, 5, 6].map((game) => (
          <div
            key={game}
            className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Game {game}</h3>
            <p className="text-sm text-muted mb-4">Coming Soon</p>
            <Button 
              variant="outline" 
              size="sm" 
              disabled
              className="w-full"
            >
              Play Game
            </Button>
          </div>
        ))}
      </div>

      {/* User Stats */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Your Profile</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{profile?.points || 0}</div>
            <div className="text-sm text-muted">Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{profile?.tickets || 0}</div>
            <div className="text-sm text-muted">Tickets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{profile?.level || 1}</div>
            <div className="text-sm text-muted">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{profile?.experience || 0}</div>
            <div className="text-sm text-muted">XP</div>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="text-center mt-8">
        <Button 
          variant="outline"
          onClick={() => {
            useAuthStore.getState().signOut()
            window.location.href = '/'
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}