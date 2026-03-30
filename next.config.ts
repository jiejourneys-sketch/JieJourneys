import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: false },
      { source: '/book', destination: '/tools/bill/book', permanent: false },
      { source: '/book/:path*', destination: '/tools/bill/book/:path*', permanent: false },
    ]
  },
  async rewrites() {
    return []
  },
}

export default nextConfig
