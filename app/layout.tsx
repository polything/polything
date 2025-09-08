import type React from "react"
import type { Metadata } from "next"
import { Inter, Raleway } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { generateSiteMetadata } from "@/lib/seo/metadata"
import { orgJsonLd, websiteJsonLd } from "@/lib/seo/structured-data"
import Script from "next/script"

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

export const metadata: Metadata = generateSiteMetadata({
  baseUrl: 'https://polything.co.uk',
  siteName: 'Polything',
  defaultDescription: 'Strategic Marketing for Visionary Brands',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@polything'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Generate site-wide structured data
  const organizationData = orgJsonLd('https://polything.co.uk', {
    name: 'Polything Ltd',
    logo: '/images/logo.png',
    sameAs: [
      'https://linkedin.com/company/polything',
      'https://twitter.com/polything',
    ],
    contactPoint: {
      telephone: '+44-1234-567890',
      contactType: 'customer service',
      email: 'hello@polything.co.uk',
    },
  })

  const websiteData = websiteJsonLd('https://polything.co.uk', 'Polything')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${raleway.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        
        {/* Site-wide JSON-LD */}
        <Script
          id="ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
      </body>
    </html>
  )
}