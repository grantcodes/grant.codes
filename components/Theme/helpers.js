import { transparentize } from 'polished'

export const theme = key => props => props.theme[key]

export const palette = key => props => props.theme.palette[key]

export const mixin = {
  fs: (size = 0) => props => {
    const ratio = 1.2
    return Math.pow(ratio, size) * 1 + 'rem'
  },
  space: (size = 1) => props => size + 'rem',
  shadow: (size = 1) => props => {
    const lightness = props.theme.palette.hsl[2]
    const shadow =
      lightness > 0.2
        ? 'rgba(0,0,0,' + (1.3 - lightness) / 4 + ')'
        : 'rgba(255,255,255,.05)'
    return `${size}px ${size}px ${4 * size}px ${shadow}`
  },
  glass: (opacity = 0.8) => props => `
  backdrop-filter: blur(1rem);
  background-color: ${transparentize(1 - opacity, props.theme.palette.mainAlt)};
  `,
}
