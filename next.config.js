const withFonts = require('next-fonts')

const config = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      loader: 'svg-inline-loader',
    })

    return config
  },
}

module.exports = withFonts(config)
