'use client'

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthStore } from "@/stores/auth";
import { 
  GameController, 
  Trophy, 
  Users, 
  Lightning,
  Coins,
  Star
} from "@phosphor-icons/react";

export default function Home() {
  const { user, profile } = useAuthStore()

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-orbitron)] neon-glow">
            ARCADE WORLD
          </h1>
          <p className="text-xl md:text-2xl text-muted max-w-3xl mx-auto">
            Play classic arcade games, earn tickets, win amazing prizes, and compete with players worldwide
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            <Link href="/games">
              <Button variant="arcade" size="lg" className="text-lg px-8 py-4">
                <GameController size={24} className="mr-2" />
                Play Games
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/signup">
                <Button variant="arcade" size="lg" className="text-lg px-8 py-4">
                  <GameController size={24} className="mr-2" />
                  Start Playing
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {user && profile && (
          <div className="flex justify-center space-x-8 pt-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-accent text-2xl font-bold">
                <Coins size={28} />
                <span>{profile.points}</span>
              </div>
              <p className="text-muted text-sm">Points</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-secondary text-2xl font-bold">
                <Trophy size={28} />
                <span>{profile.tickets}</span>
              </div>
              <p className="text-muted text-sm">Tickets</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-primary text-2xl font-bold">
                <Star size={28} />
                <span>{profile.level}</span>
              </div>
              <p className="text-muted text-sm">Level</p>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-orbitron)] neon-glow-secondary">
            How It Works
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Experience the thrill of classic arcade gaming with modern progression systems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:scale-105 transition-transform duration-200">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <GameController size={32} className="text-primary" />
              </div>
              <CardTitle>Play Games</CardTitle>
              <CardDescription>
                Choose from classic arcade games like Pac-Man and modern favorites
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform duration-200">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <Coins size={32} className="text-accent" />
              </div>
              <CardTitle>Earn Points</CardTitle>
              <CardDescription>
                Score high to earn points and convert them into valuable tickets
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform duration-200">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <Trophy size={32} className="text-secondary" />
              </div>
              <CardTitle>Win Prizes</CardTitle>
              <CardDescription>
                Use tickets to unlock prizes that enhance your gaming experience
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform duration-200">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                <Lightning size={32} className="text-success" />
              </div>
              <CardTitle>Take Challenges</CardTitle>
              <CardDescription>
                Compete in daily challenges and tournaments for bigger rewards
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Game Modes Preview */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-orbitron)] neon-glow">
            Game Modes
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Multiple ways to play and progress through Arcade World
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-3">
                <GameController size={32} className="text-primary" />
                <span>Freeplay Mode</span>
              </CardTitle>
              <CardDescription className="text-base">
                Play any unlocked game with your points. Perfect for practicing and enjoying classic arcade action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted">
                <li>• Use points to play games</li>
                <li>• Earn tickets based on performance</li>
                <li>• No time pressure or entry fees</li>
                <li>• All skill levels welcome</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-3">
                <Lightning size={32} className="text-accent" />
                <span>Challenge Mode</span>
              </CardTitle>
              <CardDescription className="text-base">
                Take on daily and weekly challenges for bigger rewards and special prizes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted">
                <li>• Daily rotating challenges</li>
                <li>• Higher risk, higher reward</li>
                <li>• Leaderboard competitions</li>
                <li>• Exclusive challenge prizes</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="text-center space-y-8 py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold font-[family-name:var(--font-orbitron)]">
              Ready to Play?
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Join thousands of players in the ultimate arcade experience. Sign up now and get 100 free points to start!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button variant="arcade" size="lg" className="text-lg px-8 py-4">
                <GameController size={24} className="mr-2" />
                Create Account
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Users size={24} className="mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
