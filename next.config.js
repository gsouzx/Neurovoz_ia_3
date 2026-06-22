/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'avatar.vercel.sh'],
  },
  experimental: {
    typedRoutes: false,
  },
}

module.exports = nextConfig
