import React from 'react'
import { cn } from '@/lib/utils'

interface GlassContainerProps {
  children: React.ReactNode
  className?: string
  variant?: 'light' | 'dark'
  showDecorations?: boolean
  decorationColors?: {
    topLeft?: string
    bottomRight?: string
  }
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  className,
  variant = 'light',
  showDecorations = true,
  decorationColors = {
    topLeft: '#FEC502',
    bottomRight: '#02AFF4'
  },
  padding = 'lg',
  rounded = 'xl'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl'
  }

  const glassClass = variant === 'dark' ? 'glass-dark' : 'glass'

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        glassClass,
        paddingClasses[padding],
        roundedClasses[rounded],
        className
      )}
    >
      {/* Decorative geometric elements */}
      {showDecorations && (
        <>
          {/* Top-left decoration */}
          <div
            className="absolute -top-10 -left-10 w-40 h-40 opacity-10 rounded-br-[40px]"
            style={{ backgroundColor: decorationColors.topLeft }}
          />
          
          {/* Bottom-right decoration */}
          <div
            className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 rounded-tl-[40px]"
            style={{ backgroundColor: decorationColors.bottomRight }}
          />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default GlassContainer
