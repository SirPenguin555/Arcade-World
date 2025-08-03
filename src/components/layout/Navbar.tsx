'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth'
import { 
  GameController, 
  User, 
  SignOut, 
  List, 
  X,
  Coins,
  Trophy
} from '@phosphor-icons/react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-lg bg-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors"
          >
            <GameController size={32} weight="bold" />
            <span className="font-bold text-xl neon-glow">Arcade World</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link 
                  href="/games" 
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Games
                </Link>
                <Link 
                  href="/challenges" 
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Challenges
                </Link>
                <Link 
                  href="/prizes" 
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Prizes
                </Link>
                
                {/* User Stats */}
                <div className="flex items-center space-x-4 px-4 py-2 bg-card border border-border rounded-lg">
                  <div className="flex items-center space-x-1 text-accent">
                    <Coins size={16} />
                    <span className="text-sm font-medium">{profile?.points || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-secondary">
                    <Trophy size={16} />
                    <span className="text-sm font-medium">{profile?.tickets || 0}</span>
                  </div>
                </div>
              </>
            )}

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/profile"
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                >
                  <User size={20} />
                  <span className="text-sm">
                    {profile?.display_name || 'Player'}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted hover:text-foreground"
                >
                  <SignOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="arcade" size="sm">
                    Play Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <List size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user && (
                <>
                  <Link
                    href="/games"
                    className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Games
                  </Link>
                  <Link
                    href="/challenges"
                    className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Challenges
                  </Link>
                  <Link
                    href="/prizes"
                    className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Prizes
                  </Link>
                  
                  {/* Mobile User Stats */}
                  <div className="flex items-center justify-between px-3 py-2 bg-card border border-border rounded-lg mx-2 my-2">
                    <div className="flex items-center space-x-1 text-accent">
                      <Coins size={16} />
                      <span className="text-sm font-medium">{profile?.points || 0} Points</span>
                    </div>
                    <div className="flex items-center space-x-1 text-secondary">
                      <Trophy size={16} />
                      <span className="text-sm font-medium">{profile?.tickets || 0} Tickets</span>
                    </div>
                  </div>
                </>
              )}

              {/* Mobile Auth Section */}
              {user ? (
                <div className="border-t border-border pt-3 mt-3">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    <span>{profile?.display_name || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 text-muted hover:text-foreground transition-colors w-full text-left"
                  >
                    <SignOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-border pt-3 mt-3 space-y-2 px-2">
                  <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="arcade" size="sm" className="w-full">
                      Play Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}