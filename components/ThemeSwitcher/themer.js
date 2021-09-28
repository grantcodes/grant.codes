import * as themer from '@grantcodes/themer'

export default function setTheme(color = false) {
  const theme = color ? themer.fromColor(color) : themer.daily()

  if (typeof window !== 'undefined') {
    window.document.body.classList.remove('theme--dark')
    window.document.body.classList.remove('theme--light')
    window.document.body.classList.add(
      theme.isDark ? 'theme--dark' : 'theme--light'
    )
    if (color) {
      window.localStorage.setItem('theme', JSON.stringify(theme))
    } else {
      window.localStorage.removeItem('theme')
    }
    for (const key in theme) {
      if (theme.hasOwnProperty(key)) {
        const value = theme[key]
        if (typeof value === 'string') {
          window.document.documentElement.style.setProperty(
            `--theme-${key}`,
            value
          )
        } else if (Array.isArray(value)) {
          value.forEach((c, i) =>
            window.document.documentElement.style.setProperty(
              `--theme-${key}-${i}`,
              c
            )
          )
        }
      }
    }
  }

  return theme
}
