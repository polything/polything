import React from 'react'

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  inline?: boolean
  showMessage?: boolean
  className?: string
}

export function Loading({
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
  inline = false,
  showMessage = true,
  className = ''
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : inline
    ? 'flex items-center justify-center p-4'
    : 'flex items-center justify-center py-8'

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <div
          role="status"
          className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
          aria-label="Loading"
        >
          {showMessage && <span className="sr-only">{message}</span>}
        </div>
        {showMessage && (
          <p className="text-sm text-gray-600 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  )
}

// Specialized loading components for common use cases
export function PageLoading({ message = 'Loading page...' }: { message?: string }) {
  return <Loading message={message} fullScreen size="lg" />
}

export function InlineLoading({ message = 'Loading...' }: { message?: string }) {
  return <Loading message={message} inline size="sm" showMessage={false} />
}

export function ButtonLoading({ message = 'Loading...' }: { message?: string }) {
  return <Loading message={message} size="sm" showMessage={false} />
}
