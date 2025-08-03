import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'arcade'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          
          // Size variants
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          
          // Style variants
          {
            // Primary
            'bg-primary text-background hover:bg-primary/90 shadow-lg': variant === 'primary',
            
            // Secondary
            'bg-secondary text-background hover:bg-secondary/90 shadow-lg': variant === 'secondary',
            
            // Outline
            'border border-primary text-primary hover:bg-primary hover:text-background': variant === 'outline',
            
            // Ghost
            'text-foreground hover:bg-card hover:text-card-foreground': variant === 'ghost',
            
            // Arcade - uses the custom arcade-button class
            'arcade-button': variant === 'arcade',
          },
          
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }