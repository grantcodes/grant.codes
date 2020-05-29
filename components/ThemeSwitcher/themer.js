import chroma from 'chroma-js'

const contrastText = color => {
  const whiteContrast = chroma.contrast(color, '#fff')
  const blackContrast = chroma.contrast(color, '#000')
  return whiteContrast > blackContrast ? '#fff' : '#000'
}

const getComplementary = color => {
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

export default function(color = false) {
  color = color ? chroma(color) : chroma.random()
  const contrast = contrastText(color)
  const palette = {
    white: '#fff',
    black: '#000',
    main: color.hex(),
    hsl: color.hsl(),
    mainAlt:
      contrast === '#000' ? color.darken(0.3).hex() : color.brighten(0.3).hex(),
    mainBorder:
      contrast === '#000' ? color.darken(0.9).hex() : color.brighten(0.9).hex(),
    complementary: getComplementary(color).hex(),
    contrast,
  }

  return palette
}
