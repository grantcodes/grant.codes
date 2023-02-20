const withFonts = require('next-fonts')

const subdomains = [
  { domain: 'where.is', path: '/where' },
  { domain: 'who.is', path: '/about' },
  { domain: 'pay', path: '/pay' },
]

const config = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['canvas'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      loader: 'svg-inline-loader',
    })

    return config
  },
  images: {
    domains: ['images.weserv.nl', 'backend.grant.codes'],
  },
  rewrites() {
    return {
      beforeFiles: subdomains.map((d) => ({
        source: '/',
        has: [
          {
            type: 'host',
            value: `${d.domain}.grant.codes`,
          },
        ],
        destination: `https://grant.codes/${d.path}/`,
        basePath: false,
      })),
    }
  },
}

module.exports = withFonts(config)
