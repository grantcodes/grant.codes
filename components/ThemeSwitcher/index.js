import React, { useState, useEffect } from 'react'
import { parseCookies, setCookie } from 'nookies'
import themer from './themer'

const ThemeSwitcher = () => {
  const { themeColor } = parseCookies()
  const [shown, setShown] = useState(false)
  const [color, setColorState] = useState(themeColor)
  const setColor = (color) => {
    setColorState(color)
    setCookie(null, 'themeColor', color, { path: '/' })
    themer(color)
  }

  useEffect(() => {
    setShown(true)
    // Load theme from cookie.
    themer(color)
  }, [])

  if (!shown) {
    return null
  }

  // TODO: Maybe add a way to reset / randomize colors

  return (
    <div class="theme-switcher">
      <label htmlFor="theme-switcher__color" class="theme-switcher__label">
        <span role="img" alt="Theme Color">
          🎨
        </span>
      </label>
      <input
        type="color"
        id="theme-switcher__color"
        class="theme-switcher__input"
        value={color ? color : '#123456'}
        onChange={(e) => {
          setColor(e.target.value)
        }}
      />
    </div>
  )
}

export default ThemeSwitcher
