import { cn } from '@/lib/utils'
import Container from './container'

interface SectionProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  background?: 'white' | 'gray' | 'brand' | 'transparent'
  container?: boolean
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const Section: React.FC<SectionProps> = ({
  children,
  className,
  size = 'md',
  background = 'white',
  container = true,
  containerSize = 'lg'
}) => {
  const sizeClasses = {
    sm: 'py-8 md:py-16',
    md: 'py-16 md:py-24', 
    lg: 'py-24 md:py-32',
  }

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    brand: 'bg-gradient-to-br from-white via-gray-50 to-gray-100',
    transparent: 'bg-transparent',
  }

  const content = (
    <div className={cn(
      sizeClasses[size],
      backgroundClasses[background],
      className
    )}>
      {children}
    </div>
  )

  if (container) {
    return (
      <Container size={containerSize}>
        {content}
      </Container>
    )
  }

  return content
}

export default Section
