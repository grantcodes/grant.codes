const withFonts = require('next-fonts')

const subdomains = [
  { domain: 'where.is', path: '/where' },
  { domain: 'who.is', path: '/about' },
  { domain: 'pay', path: '/pay' },
]

const config = {
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
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: `${d.domain}.grant.codes`,
          },
        ],
        destination: `/${d.path}/:path*`,
      })),
    }
  },
}

module.exports = withFonts(config)
