import { cn } from '@/lib/utils'
import { cardVariants, glassClasses } from '@/lib/design-system'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'elevated'
  glassVariant?: 'light' | 'dark' | 'subtle' | 'strong'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  interactive?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  glassVariant = 'light',
  padding = 'md',
  hover = false,
  interactive = false
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }

  const getVariantClasses = () => {
    if (variant === 'glass') {
      return glassClasses[glassVariant]
    }
    return cardVariants[variant]
  }

  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-300' : ''
  const interactiveClasses = interactive ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''

  return (
    <div 
      className={cn(
        getVariantClasses(),
        paddingClasses[padding],
        hoverClasses,
        interactiveClasses,
        className
      )}
    >
      {children}
    </div>
  )
}

// Card Header Component
interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  )
}

// Card Content Component
interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  )
}

// Card Footer Component
interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-100', className)}>
      {children}
    </div>
  )
}

export default Card
