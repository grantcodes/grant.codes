import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { parseCookies, setCookie } from 'nookies'

const Wrapper = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;

  label {
    cursor: pointer;
    display: block;
    opacity: 0.4;
    line-height: 1;
    &:hover,
    &:focus {
      opacity: 0.8;
    }
  }

  input {
    visibility: hidden;
    position: absolute;
  }
`

const ThemeSwitcher = () => {
  const { themeColor } = parseCookies()
  const [shown, setShown] = useState(false)
  const [color, setColorState] = useState(themeColor)
  const setColor = (color) => {
    setColorState(color)
    setCookie(null, 'themeColor', color, { path: '/' })
    // Dispatch an event instead of using state
    const event = new CustomEvent('grantcodes-theme', { detail: color })
    document.body.dispatchEvent(event)
  }

  useEffect(() => {
    setShown(true)
  }, [])

  if (!shown) {
    return null
  }

  // TODO: Maybe add a way to reset / randomize colors

  return (
    <Wrapper>
      <label htmlFor="theme-switcher__color">
        <span role="img" alt="Theme Color">
          🎨
        </span>
      </label>
      <input
        type="color"
        id="theme-switcher__color"
        value={color ? color : '#123456'}
        onChange={(e) => {
          setColor(e.target.value)
        }}
      />
    </Wrapper>
  )
}

export default ThemeSwitcher
