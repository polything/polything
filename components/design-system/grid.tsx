import { cn } from '@/lib/utils'

interface GridProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12
    md?: 1 | 2 | 3 | 4 | 6 | 12
    lg?: 1 | 2 | 3 | 4 | 6 | 12
    xl?: 1 | 2 | 3 | 4 | 6 | 12
  }
}

const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = 1,
  gap = 'md',
  responsive
}) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-8 md:gap-12',
    lg: 'gap-12 md:gap-16',
    xl: 'gap-16 md:gap-20',
  }

  const getColClasses = (cols: number) => {
    const colMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6',
    }
    return colMap[cols] || 'grid-cols-1'
  }

  // Build responsive grid classes
  const buildResponsiveClasses = () => {
    if (!responsive) {
      return getColClasses(cols)
    }

    let classes = 'grid-cols-1'
    
    if (responsive.sm) {
      classes += ` sm:grid-cols-${responsive.sm}`
    }
    if (responsive.md) {
      classes += ` md:grid-cols-${responsive.md}`
    }
    if (responsive.lg) {
      classes += ` lg:grid-cols-${responsive.lg}`
    }
    if (responsive.xl) {
      classes += ` xl:grid-cols-${responsive.xl}`
    }

    return classes
  }

  return (
    <div 
      className={cn(
        'grid',
        responsive ? buildResponsiveClasses() : getColClasses(cols),
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

export default Grid
