var theme = localStorage.getItem('theme')
if (theme) {
  theme = JSON.parse(theme)
  if (theme) {
    Object.keys(theme).forEach(function (key) {
      var color = theme[key]
      if (typeof color !== 'string' && color._rgb) {
        color = 'rgba(' + color._rgb.join(',') + ')'
      }
      if (Array.isArray(color)) {
        color.forEach(function (c, i) {
          window.document.body.style.setProperty(
            '--theme-' + key + '-' + i,
            c.toString()
          )
        })
      } else {
        console.log('color', color)
        window.document.body.style.setProperty(
          '--theme-' + key,
          color.toString()
        )
      }
    })
  }
}
