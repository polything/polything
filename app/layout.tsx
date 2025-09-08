import type React from "react"
import type { Metadata } from "next"
import { Inter, Raleway } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
})

export const metadata: Metadata = {
  title: "Polything | Strategic Marketing for Visionary Brands",
  description:
    "We help founders and teams cut through the noise, sharpen their strategy, and build marketing that actually works.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Organization structured data
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Polything Ltd',
    url: 'https://polything.co.uk',
    logo: 'https://polything.co.uk/logo.png',
    description: 'Strategic Marketing for Visionary Brands',
    sameAs: [
      'https://linkedin.com/company/polything',
      'https://twitter.com/polything',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+44-1234-567890',
      contactType: 'customer service',
      email: 'hello@polything.co.uk',
    },
  }

  // Website structured data
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: 'Polything',
    url: 'https://polything.co.uk',
    description: 'Strategic Marketing for Visionary Brands',
    publisher: {
      '@type': 'Organization',
      name: 'Polything Ltd',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
        {/* Website JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
      </head>
      <body className={`${inter.variable} ${raleway.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
