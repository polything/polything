import { describe, it, expect } from '@jest/globals'
import { render } from '@testing-library/react'
import RootLayout from './layout'

// Mock Next.js fonts
jest.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-inter',
  }),
  Raleway: () => ({
    variable: '--font-raleway',
  }),
}))

// Mock theme provider
jest.mock('@/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('Root Layout', () => {
  it('should render children content', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    expect(getByText('Test Content')).toBeInTheDocument()
  })

  it('should have proper component structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    // Verify the component renders without errors
    expect(container.firstChild).toBeInTheDocument()
  })
})
