import { withContentlayer } from 'next-contentlayer2'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Case studies redirects
      {
        source: '/case-studies/:slug',
        destination: '/work/:slug',
        permanent: true,
      },
      
      // Blog redirects
      {
        source: '/the-marketing-brief/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      
      // Services redirects
      {
        source: '/marketing-strategy',
        destination: '/services/marketing-strategy',
        permanent: true,
      },
      {
        source: '/marketing-services',
        destination: '/services/marketing-services',
        permanent: true,
      },
      {
        source: '/business-mentoring',
        destination: '/services/business-mentoring',
        permanent: true,
      },
    ]
  },
}

export default withContentlayer(nextConfig)
