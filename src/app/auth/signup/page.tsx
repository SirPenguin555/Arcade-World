import { SignUpForm } from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Sign Up - Arcade World',
  description: 'Join Arcade World today and start your arcade gaming adventure.',
}