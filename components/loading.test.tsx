import React from 'react'
import { render, screen } from '@testing-library/react'
import { Loading } from './loading'

describe('Loading', () => {
  it('should render default loading spinner', () => {
    render(<Loading />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading...', { selector: 'p' })).toBeInTheDocument()
  })

  it('should render with custom message', () => {
    const customMessage = 'Loading content...'
    render(<Loading message={customMessage} />)
    
    expect(screen.getByText(customMessage, { selector: 'p' })).toBeInTheDocument()
  })

  it('should render with custom size', () => {
    render(<Loading size="lg" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-12', 'h-12')
  })

  it('should render with small size', () => {
    render(<Loading size="sm" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-4', 'h-4')
  })

  it('should render with medium size', () => {
    render(<Loading size="md" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-8', 'h-8')
  })

  it('should render with custom className', () => {
    const customClass = 'custom-loading'
    render(<Loading className={customClass} />)
    
    const container = screen.getByRole('status').parentElement?.parentElement
    expect(container).toHaveClass(customClass)
  })

  it('should render full screen loading', () => {
    render(<Loading fullScreen />)
    
    const container = screen.getByRole('status').parentElement?.parentElement
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center')
  })

  it('should render inline loading', () => {
    render(<Loading inline />)
    
    const container = screen.getByRole('status').parentElement?.parentElement
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'p-4')
  })

  it('should render without message when showMessage is false', () => {
    render(<Loading showMessage={false} />)
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
