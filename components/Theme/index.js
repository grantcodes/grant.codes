import React, { useState, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { parseCookies, setCookie } from 'nookies'
import themer from '../ThemeSwitcher/themer'
import chroma from 'chroma-js'

const Theme = ({ children, ...props }) => {
  // Get the theme from stored cookie random color cookie (is cookie so it works on the server or the client)
  let { randomColor, themeColor } = parseCookies()

  if (!randomColor) {
    randomColor = chroma.random().hex()
    setCookie(null, 'randomColor', randomColor, { path: '/' })
  }

  const [theme, setTheme] = useState({
    palette: themer(themeColor || randomColor),
    cardPadding: '1rem',
    borderRadius: '3px',
    contentWidth: '550px',
    midBreak: 'calc(34rem + 290px)',
    contentWidth: '34rem',
    sideWidth: '18rem',
    midBreak: 34 + 18 + 'rem',
    headerHeight: '4rem',
    themeTransitionTime: '0.5s',
    widthNormal: '50rem',
    widthWide: '70rem',
  })

  useEffect(() => {
    const listener = (e) => {
      const palette = themer(e.detail)
      setTheme({ ...theme, palette })
    }

    document.body.addEventListener('grantcodes-theme', listener)

    return () => {
      document.body.removeEventListener('grantcodes-theme', listener)
    }
  })

  return (
    <ThemeProvider theme={theme} {...props}>
      {children}
    </ThemeProvider>
  )
}

export default Theme
