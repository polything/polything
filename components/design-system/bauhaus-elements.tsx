import { cn } from '@/lib/utils'
import { bauhausElements } from '@/lib/design-system'

interface BauhausElementProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'yellow' | 'lightBlue' | 'orange' | 'red' | 'green' | 'navy'
  opacity?: number
  animation?: 'none' | 'float' | 'floatDelay1' | 'floatDelay2' | 'rotate' | 'pulse'
  position?: 'absolute' | 'relative' | 'fixed'
}

// Circle Element
interface CircleProps extends BauhausElementProps {
  variant?: 'filled' | 'outline'
  borderWidth?: 'thin' | 'medium' | 'thick'
}

export const BauhausCircle: React.FC<CircleProps> = ({
  className,
  size = 'md',
  color = 'yellow',
  opacity = 0.4,
  animation = 'none',
  position = 'absolute',
  variant = 'filled',
  borderWidth = 'medium'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-64 h-64',
  }

  const colorClasses = {
    yellow: 'bg-brand-yellow border-brand-yellow',
    lightBlue: 'bg-brand-lightBlue border-brand-lightBlue',
    orange: 'bg-brand-orange border-brand-orange',
    red: 'bg-brand-red border-brand-red',
    green: 'bg-brand-green border-brand-green',
    navy: 'bg-brand-navy border-brand-navy',
  }

  const borderWidthClasses = {
    thin: 'border-2',
    medium: 'border-4',
    thick: 'border-8',
  }

  const positionClasses = {
    absolute: 'absolute',
    relative: 'relative',
    fixed: 'fixed',
  }

  const animationClasses = {
    none: '',
    float: bauhausElements.animations.float,
    floatDelay1: bauhausElements.animations.floatDelay1,
    floatDelay2: bauhausElements.animations.floatDelay2,
    rotate: bauhausElements.animations.rotate,
    pulse: bauhausElements.animations.pulse,
  }

  const elementClasses = cn(
    bauhausElements.circle,
    sizeClasses[size],
    colorClasses[color],
    positionClasses[position],
    animationClasses[animation],
    variant === 'outline' && borderWidthClasses[borderWidth],
    variant === 'filled' && 'border-0',
    className
  )

  const style = {
    opacity,
  }

  return <div className={elementClasses} style={style} />
}

// Square Element
interface SquareProps extends BauhausElementProps {
  variant?: 'filled' | 'outline'
  borderWidth?: 'thin' | 'medium' | 'thick'
}

export const BauhausSquare: React.FC<SquareProps> = ({
  className,
  size = 'md',
  color = 'yellow',
  opacity = 0.4,
  animation = 'none',
  position = 'absolute',
  variant = 'filled',
  borderWidth = 'medium'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-64 h-64',
  }

  const colorClasses = {
    yellow: 'bg-brand-yellow border-brand-yellow',
    lightBlue: 'bg-brand-lightBlue border-brand-lightBlue',
    orange: 'bg-brand-orange border-brand-orange',
    red: 'bg-brand-red border-brand-red',
    green: 'bg-brand-green border-brand-green',
    navy: 'bg-brand-navy border-brand-navy',
  }

  const borderWidthClasses = {
    thin: 'border-2',
    medium: 'border-4',
    thick: 'border-8',
  }

  const positionClasses = {
    absolute: 'absolute',
    relative: 'relative',
    fixed: 'fixed',
  }

  const animationClasses = {
    none: '',
    float: bauhausElements.animations.float,
    floatDelay1: bauhausElements.animations.floatDelay1,
    floatDelay2: bauhausElements.animations.floatDelay2,
    rotate: bauhausElements.animations.rotate,
    pulse: bauhausElements.animations.pulse,
  }

  const elementClasses = cn(
    bauhausElements.square,
    sizeClasses[size],
    colorClasses[color],
    positionClasses[position],
    animationClasses[animation],
    variant === 'outline' && borderWidthClasses[borderWidth],
    variant === 'filled' && 'border-0',
    className
  )

  const style = {
    opacity,
  }

  return <div className={elementClasses} style={style} />
}

// Triangle Element
interface TriangleProps extends BauhausElementProps {
  variant?: 'filled' | 'outline'
  borderWidth?: 'thin' | 'medium' | 'thick'
}

export const BauhausTriangle: React.FC<TriangleProps> = ({
  className,
  size = 'md',
  color = 'yellow',
  opacity = 0.4,
  animation = 'none',
  position = 'absolute',
  variant = 'filled',
  borderWidth = 'medium'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-64 h-64',
  }

  const colorClasses = {
    yellow: 'bg-brand-yellow border-brand-yellow',
    lightBlue: 'bg-brand-lightBlue border-brand-lightBlue',
    orange: 'bg-brand-orange border-brand-orange',
    red: 'bg-brand-red border-brand-red',
    green: 'bg-brand-green border-brand-green',
    navy: 'bg-brand-navy border-brand-navy',
  }

  const borderWidthClasses = {
    thin: 'border-2',
    medium: 'border-4',
    thick: 'border-8',
  }

  const positionClasses = {
    absolute: 'absolute',
    relative: 'relative',
    fixed: 'fixed',
  }

  const animationClasses = {
    none: '',
    float: bauhausElements.animations.float,
    floatDelay1: bauhausElements.animations.floatDelay1,
    floatDelay2: bauhausElements.animations.floatDelay2,
    rotate: bauhausElements.animations.rotate,
    pulse: bauhausElements.animations.pulse,
  }

  const elementClasses = cn(
    bauhausElements.triangle,
    sizeClasses[size],
    colorClasses[color],
    positionClasses[position],
    animationClasses[animation],
    variant === 'outline' && borderWidthClasses[borderWidth],
    variant === 'filled' && 'border-0',
    className
  )

  const style = {
    opacity,
  }

  return <div className={elementClasses} style={style} />
}

// Geometric Pattern Component
interface GeometricPatternProps {
  className?: string
  pattern?: 'grid' | 'dots' | 'lines' | 'circles'
  opacity?: number
  color?: 'gray' | 'brand'
}

export const GeometricPattern: React.FC<GeometricPatternProps> = ({
  className,
  pattern = 'grid',
  opacity = 0.1,
  color = 'gray'
}) => {
  const colorClasses = {
    gray: 'border-gray-300',
    brand: 'border-brand-yellow',
  }

  const patternClasses = {
    grid: 'grid grid-cols-12 gap-4',
    dots: 'grid grid-cols-8 gap-8',
    lines: 'flex flex-col space-y-4',
    circles: 'grid grid-cols-6 gap-6',
  }

  const renderPattern = () => {
    switch (pattern) {
      case 'grid':
        return Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`h-full border-l ${colorClasses[color]}`} />
        ))
      case 'dots':
        return Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className={`w-1 h-1 rounded-full ${colorClasses[color].replace('border-', 'bg-')}`} />
        ))
      case 'lines':
        return Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`w-full border-t ${colorClasses[color]} flex-1`} />
        ))
      case 'circles':
        return Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${colorClasses[color].replace('border-', 'bg-')}`} />
        ))
      default:
        return null
    }
  }

  return (
    <div 
      className={cn(
        'fixed inset-0 pointer-events-none -z-20',
        patternClasses[pattern],
        className
      )}
      style={{ opacity }}
    >
      {renderPattern()}
    </div>
  )
}

