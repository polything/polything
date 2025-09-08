import { cn } from '@/lib/utils'
import { typographyClasses } from '@/lib/design-system'

interface TypographyProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
}

// Heading Component
interface HeadingProps extends TypographyProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  color?: 'default' | 'brand' | 'muted' | 'white'
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  className,
  level,
  color = 'default',
  as
}) => {
  const Component = as || (`h${level}` as keyof JSX.IntrinsicElements)
  
  const colorClasses = {
    default: 'text-gray-900',
    brand: 'text-brand-yellow',
    muted: 'text-gray-600',
    white: 'text-white',
  }

  const headingClass = typographyClasses.heading[`h${level}` as keyof typeof typographyClasses.heading]

  return (
    <Component 
      className={cn(
        headingClass,
        colorClasses[color],
        className
      )}
    >
      {children}
    </Component>
  )
}

// Text Component
interface TextProps extends TypographyProps {
  size?: 'small' | 'base' | 'large'
  color?: 'default' | 'muted' | 'brand' | 'white'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
}

export const Text: React.FC<TextProps> = ({
  children,
  className,
  size = 'base',
  color = 'default',
  weight = 'normal',
  as = 'p'
}) => {
  const Component = as

  const sizeClasses = {
    small: typographyClasses.body.small,
    base: typographyClasses.body.base,
    large: typographyClasses.body.large,
  }

  const colorClasses = {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    brand: 'text-brand-yellow',
    white: 'text-white',
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  return (
    <Component 
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        weightClasses[weight],
        className
      )}
    >
      {children}
    </Component>
  )
}

// Lead Text Component (for introductory paragraphs)
interface LeadTextProps extends Omit<TextProps, 'size'> {
  className?: string
}

export const LeadText: React.FC<LeadTextProps> = ({
  children,
  className,
  color = 'default',
  weight = 'normal',
  as = 'p'
}) => {
  return (
    <Text
      size="large"
      color={color}
      weight={weight}
      as={as}
      className={cn('text-lg md:text-xl leading-relaxed', className)}
    >
      {children}
    </Text>
  )
}

// Small Text Component
interface SmallTextProps extends Omit<TextProps, 'size'> {
  className?: string
}

export const SmallText: React.FC<SmallTextProps> = ({
  children,
  className,
  color = 'muted',
  weight = 'normal',
  as = 'p'
}) => {
  return (
    <Text
      size="small"
      color={color}
      weight={weight}
      as={as}
      className={cn('text-sm md:text-base', className)}
    >
      {children}
    </Text>
  )
}
