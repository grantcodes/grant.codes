import chroma from 'chroma-js'

const isDark = (color) => {
  const whiteContrast = chroma.contrast(color, '#fff')
  const blackContrast = chroma.contrast(color, '#000')
  return whiteContrast > blackContrast
}

const contrastText = (color) => {
  return isDark(color)
    ? chroma.mix(color, '#fff', 0.8)
    : chroma.mix(color, '#000', 0.9)
}

const getComplementary = (color) => {
  const hsl = color.hsl()
  if (hsl[2] < 0.2) {
    // Pretty dark, so make the color lighter
    color = color.set('hsl.l', '+0.2')
  } else if (hsl[2] > 0.8) {
    // Pretty bright, sp make the color darker
    color = color.set('hsl.l', '-0.2')
  }
  // Rotate the hue almost 180 deg
  return color.set('hsl.h', '+180')
}

export default function themer(color = false) {
  color = color ? chroma(color) : chroma.random()
  const dark = isDark(color)
  const width =
    typeof window !== 'undefined'
      ? window.screen.availWidth * window.devicePixelRatio
      : 1920
  const height =
    typeof window !== 'undefined'
      ? window.screen.availHeight * window.devicePixelRatio
      : 1080

  const palette = {
    'color-main': color.hex(),
    'color-main--alt': dark
      ? color.brighten(0.3).hex()
      : color.darken(0.3).hex(),
    'color-main--border': dark
      ? color.brighten(0.9).hex()
      : color.darken(0.9).hex(),
    'color-complementary': getComplementary(color).hex(),
    'color-contrast': contrastText(color).hex(),
    'color-glass':
      'rgba(' + dark
        ? color.brighten(2).alpha(0.1)
        : color.darken(2).alpha(0.1).rgba() + ')',
    'background-image': `url(https://twitter-topography-banner.glitch.me/${width}/${height}/${color
      .hex()
      .replace('#', '')})`,
  }

  if (typeof window !== 'undefined') {
    window.document.body.classList.remove('theme--dark')
    window.document.body.classList.remove('theme--light')
    window.document.body.classList.add(dark ? 'theme--dark' : 'theme--light')
    window.localStorage.setItem('theme', JSON.stringify({ palette, dark }))
    for (const key in palette) {
      if (palette.hasOwnProperty(key)) {
        const color = palette[key]
        window.document.documentElement.style.setProperty(`--${key}`, color)
      }
    }
  }

  return palette
}
