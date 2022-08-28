/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/loans',
        permanent: true,
      },
    ]
  },
  images:{
    domains:['api.nftfi.com', 'img.seadn.io', '*', 'integration-api.nftfi.com']
  }
}

module.exports = nextConfig
