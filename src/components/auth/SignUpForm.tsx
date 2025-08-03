'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuthStore } from '@/stores/auth'
import { UsernameService } from '@/lib/supabase/usernames'
import { GoogleLogo, Eye, EyeSlash, CheckCircle, XCircle } from '@phosphor-icons/react'

const signUpSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be no more than 20 characters')
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/, 
      'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignUpFormData = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const router = useRouter()
  const { signUp, signInWithGoogle, signInAnonymously, error, clearError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const watchedUsername = watch('username')

  // Check username availability with debouncing
  const checkUsername = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus('idle')
      setUsernameError(null)
      return
    }

    // Check format first
    const formatError = UsernameService.getValidationError(username)
    if (formatError) {
      setUsernameStatus('taken')
      setUsernameError(formatError)
      return
    }

    setUsernameStatus('checking')
    setUsernameError(null)

    try {
      const isAvailable = await UsernameService.isUsernameAvailable(username)
      if (isAvailable) {
        setUsernameStatus('available')
        setUsernameError(null)
      } else {
        setUsernameStatus('taken')
        setUsernameError('Username is already taken')
      }
    } catch (error) {
      console.error('Error checking username:', error)
      setUsernameStatus('idle')
      setUsernameError('Unable to check username availability')
    }
  }, [])

  // Debounce username checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (watchedUsername) {
        checkUsername(watchedUsername)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [watchedUsername, checkUsername])

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    clearError()

    // Final username check before submission
    if (usernameStatus !== 'available') {
      setError('username', { 
        message: usernameError || 'Please choose a valid username' 
      })
      setIsLoading(false)
      return
    }

    const result = await signUp(data.email, data.password, data.displayName, data.username)
    
    if (result.success) {
      router.push('/games')
    } else {
      setError('root', { 
        message: result.error || 'Failed to create account' 
      })
    }
    
    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    clearError()

    const result = await signInWithGoogle()
    
    if (result.success) {
      router.push('/games')
    } else {
      setError('root', { 
        message: result.error || 'Failed to sign in with Google' 
      })
    }
    
    setIsLoading(false)
  }

  const handleGuestSignIn = async () => {
    setIsLoading(true)
    clearError()

    const result = await signInAnonymously()
    
    if (result.success) {
      router.push('/games')
    } else {
      setError('root', { 
        message: result.error || 'Failed to sign in as guest' 
      })
    }
    
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold neon-glow">Join Arcade World</CardTitle>
        <CardDescription>
          Create your account and start playing today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('displayName')}
              type="text"
              placeholder="Display name"
              error={errors.displayName?.message}
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Input
              {...register('username')}
              type="text"
              placeholder="Username"
              error={errors.username?.message || usernameError || undefined}
              disabled={isLoading}
            />
            <div className="absolute right-3 top-2 flex items-center">
              {usernameStatus === 'checking' && (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
              {usernameStatus === 'available' && (
                <CheckCircle size={20} className="text-success" />
              )}
              {usernameStatus === 'taken' && (
                <XCircle size={20} className="text-error" />
              )}
            </div>
          </div>

          <div>
            <Input
              {...register('email')}
              type="email"
              placeholder="Email address"
              error={errors.email?.message}
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              error={errors.password?.message}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-muted hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <Input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              error={errors.confirmPassword?.message}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2 text-muted hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {(errors.root || error) && (
            <p className="text-sm text-error">
              {errors.root?.message || error}
            </p>
          )}

          <Button
            type="submit"
            variant="arcade"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
          >
            <GoogleLogo size={20} className="mr-2" />
            Google
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleGuestSignIn}
            disabled={isLoading}
            className="w-full"
          >
            Play as Guest
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted">Already have an account? </span>
          <Link
            href="/auth/signin"
            className="text-primary hover:text-secondary transition-colors font-medium"
          >
            Sign in here
          </Link>
        </div>

        <div className="text-xs text-muted text-center">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </div>
      </CardContent>
    </Card>
  )
}