import { cn } from '@/lib/utils'
import { layoutClasses } from '@/lib/design-system'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className,
  size = 'lg',
  padding = 'md'
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  }

  const paddingClasses = {
    none: '',
    sm: 'px-4',
    md: 'px-4 md:px-8',
    lg: 'px-6 md:px-12',
  }

  return (
    <div 
      className={cn(
        'mx-auto',
        sizeClasses[size],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

export default Container
