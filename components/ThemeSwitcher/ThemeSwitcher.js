'use client'

import { useEffect, useRef } from 'react'
import setTheme from './themer'
import useLongPress from 'lib/hooks/use-long-press'

const ThemeSwitcher = () => {
  let color = null
  try {
    const themeJson =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('theme')
        : null
    const theme = themeJson ? JSON.parse(themeJson) : null
    color = theme?.palette?.['color-main'] ?? null
  } catch (err) {
    // Error getting theme from local storage - but probably no big deal
  }

  const inputRef = useRef()

  const longPressProps = useLongPress(
    () => {
      setTheme()
    },
    () => {
      if (inputRef.current) {
        inputRef.current.click()
      }
    },
    { shouldPreventDefault: true, delay: 800 }
  )

  useEffect(() => {
    // Use daily theme if no default theme set
    if (!window.localStorage.getItem('theme')) {
      setTheme()
    }
  }, [])

  return (
    <div className="theme-switcher" {...longPressProps}>
      <label htmlFor="theme-switcher__color" className="theme-switcher__label">
        <span role="img" title="Theme Color">
          🎨
        </span>
      </label>
      <input
        type="color"
        id="theme-switcher__color"
        className="theme-switcher__input"
        value={color ? color : '#123456'}
        onChange={(e) => setTheme(e.target.value)}
        ref={inputRef}
      />
    </div>
  )
}

export default ThemeSwitcher
