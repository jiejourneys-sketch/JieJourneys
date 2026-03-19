import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  basePath: '/tools/bill',
  webpack: (config, { dev }) => {
    if (dev) config.cache = false
    return config
  },
  async rewrites() {
    return [
      { source: '/', destination: '/index.html' },
      { source: '/contact', destination: '/contact.html' },
      { source: '/contact/', destination: '/contact.html' },
    ]
  },
}

export default nextConfig
