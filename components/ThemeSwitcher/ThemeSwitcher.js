import themer from './themer'

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

  // TODO: Maybe add a way to reset / randomize colors

  return (
    <div className="theme-switcher">
      <label htmlFor="theme-switcher__color" className="theme-switcher__label">
        <span role="img" alt="Theme Color">
          🎨
        </span>
      </label>
      <input
        type="color"
        id="theme-switcher__color"
        className="theme-switcher__input"
        value={color ? color : '#123456'}
        onChange={(e) => themer(e.target.value)}
      />
    </div>
  )
}

export default ThemeSwitcher
