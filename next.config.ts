import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) config.cache = false
    return config
  },
  async rewrites() {
    return [
      { source: '/tools/bill', destination: 'https://jiejourneys-bill.vercel.app' },
      { source: '/tools/bill/:path*', destination: 'https://jiejourneys-bill.vercel.app/:path*' },
      { source: '/book', destination: 'https://jiejourneys-bill.vercel.app/book' },
      { source: '/book/:path*', destination: 'https://jiejourneys-bill.vercel.app/book/:path*' },
      { source: '/api/:path*', destination: 'https://jiejourneys-bill.vercel.app/api/:path*' },
      // 首頁、聯絡由 app 處理
    ]
  },
}

export default nextConfig
