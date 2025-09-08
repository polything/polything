import { cn } from '@/lib/utils'
import { buttonVariants } from '@/lib/design-system'
import { Button as BaseButton } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  href?: string
  target?: string
  rel?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  href,
  target,
  rel
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  }

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }

  const iconSpacingClasses = {
    sm: iconPosition === 'left' ? 'mr-2' : 'ml-2',
    md: iconPosition === 'left' ? 'mr-2' : 'ml-2',
    lg: iconPosition === 'left' ? 'mr-3' : 'ml-3',
    xl: iconPosition === 'left' ? 'mr-3' : 'ml-3',
  }

  const buttonClasses = cn(
    buttonVariants[variant],
    sizeClasses[size],
    loading && 'opacity-50 cursor-not-allowed',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  const iconClasses = cn(
    iconSizeClasses[size],
    iconSpacingClasses[size],
    'transition-transform group-hover:translate-x-1'
  )

  const content = (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon className={iconClasses} />
      )}
      {loading ? 'Loading...' : children}
      {Icon && iconPosition === 'right' && (
        <Icon className={iconClasses} />
      )}
    </>
  )

  // If href is provided, render as a link
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={cn(buttonClasses, 'inline-block text-center no-underline')}
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  // Otherwise render as button
  return (
    <BaseButton
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {content}
    </BaseButton>
  )
}

// Button Group Component
interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg'
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  orientation = 'horizontal',
  spacing = 'md'
}) => {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  }

  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    md: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
    lg: orientation === 'horizontal' ? 'space-x-6' : 'space-y-6',
  }

  return (
    <div 
      className={cn(
        'flex',
        orientationClasses[orientation],
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  )
}

export default Button
export { ButtonGroup }
