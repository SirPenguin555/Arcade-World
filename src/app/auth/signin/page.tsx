import { SignInForm } from '@/components/auth/SignInForm'

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Sign In - Arcade World',
  description: 'Sign in to your Arcade World account to play games and track your progress.',
}