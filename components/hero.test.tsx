import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import Hero from './hero'

describe('Hero Component', () => {
  it('should render hero with title and subtitle', () => {
    const mockHero = {
      title: 'Test Hero Title',
      subtitle: 'Test Hero Subtitle',
      image: '/images/test-hero.jpg',
      video: '',
      text_color: '#ffffff',
      background_color: '#000000',
    }

    render(<Hero hero={mockHero} />)
    
    expect(screen.getByText('Test Hero Title')).toBeInTheDocument()
    expect(screen.getByText('Test Hero Subtitle')).toBeInTheDocument()
  })

  it('should render hero image when provided', () => {
    const mockHero = {
      title: 'Test Hero Title',
      subtitle: 'Test Hero Subtitle',
      image: '/images/test-hero.jpg',
      video: '',
      text_color: '#ffffff',
      background_color: '#000000',
    }

    render(<Hero hero={mockHero} />)
    
    const heroImage = screen.getByRole('img')
    expect(heroImage).toBeInTheDocument()
    // Next.js Image component transforms the src, so we check it contains our path (URL encoded)
    expect(heroImage.getAttribute('src')).toContain('%2Fimages%2Ftest-hero.jpg')
  })

  it('should render hero video when provided', () => {
    const mockHero = {
      title: 'Test Hero Title',
      subtitle: 'Test Hero Subtitle',
      image: '',
      video: '/images/test-hero.mp4',
      text_color: '#ffffff',
      background_color: '#000000',
    }

    render(<Hero hero={mockHero} />)
    
    // Video element doesn't have a role, so we query by tag name
    const heroVideo = document.querySelector('video')
    expect(heroVideo).toBeInTheDocument()
    // Video has a source element inside, not a direct src attribute
    const videoSource = document.querySelector('video source')
    expect(videoSource).toHaveAttribute('src', '/images/test-hero.mp4')
  })

  it('should apply custom text color when provided', () => {
    const mockHero = {
      title: 'Test Hero Title',
      subtitle: 'Test Hero Subtitle',
      image: '',
      video: '',
      text_color: '#ff0000',
      background_color: '#000000',
    }

    render(<Hero hero={mockHero} />)
    
    const heroContent = screen.getByTestId('hero-content')
    expect(heroContent).toHaveStyle('color: #ff0000')
  })

  it('should apply custom background color when provided', () => {
    const mockHero = {
      title: 'Test Hero Title',
      subtitle: 'Test Hero Subtitle',
      image: '',
      video: '',
      text_color: '#ffffff',
      background_color: '#ff0000',
    }

    render(<Hero hero={mockHero} />)
    
    const heroSection = screen.getByTestId('hero-section')
    expect(heroSection).toHaveStyle('background-color: #ff0000')
  })

  it('should render without hero data gracefully', () => {
    render(<Hero hero={null} />)
    
    // Should not crash and should render empty state
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
  })

  it('should render with minimal hero data', () => {
    const mockHero = {
      title: 'Minimal Title',
      subtitle: '',
      image: '',
      video: '',
      text_color: '',
      background_color: '',
    }

    render(<Hero hero={mockHero} />)
    
    expect(screen.getByText('Minimal Title')).toBeInTheDocument()
  })
})
