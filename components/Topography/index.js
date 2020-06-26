import React, { useContext } from 'react'
import chroma from 'chroma-js'
import P5Wrapper from 'react-p5-wrapper'

const fullWidth = Math.max(
  typeof document !== 'undefined' ? document.documentElement.clientWidth : 1920
)
const fullHeight = Math.max(
  typeof document !== 'undefined' ? document.documentElement.clientHeight : 1080
)
const colorCount = 5
const getColors = (from, to) =>
  chroma
    .scale([from, to])
    .mode('lch') // Rainbowy
    // .mode('lab') // Quite a hormal gradient
    // .mode('hsl') // Bright rainbowy
    // .mode('lrgb') // Pretty normal gradient, with less potential muddy spots
    .colors(colorCount)

const Topography = ({ width = fullWidth, height = fullHeight }) => {
  const sketch = function (p) {
    let ox = p.random(10000)
    let oy = p.random(10000)

    const spacing = 10
    const magnitude = (Math.max(width, height) / colorCount) * 2 // Bigger number = bigger rings
    const noise_delta = 50 // Bigger number = less circular
    const noise_radius = 0.9 // Smaller = smoother

    p.setup = function () {
      p.createCanvas(width, height)
      p.smooth()
      p.noLoop()
      p.noStroke()
    }

    p.draw = function () {
      p.translate(width, 0)
      display()
    }

    p.windowResized = function () {
      p.resizeCanvas(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight
      )
      display()
    }

    function display() {
      // TODO: Get colors from css custom properties
      let colors = getColors(theme.palette.complementary, theme.palette.main)
      p.background(theme.palette.main)
      let arr = []
      ox = p.random(10000)
      oy = p.random(10000)
      for (let i = 0; i < 360; i++) {
        arr.push(p.random(1))
      }
      for (let i = 0; i < colors.length; i++) {
        let new_arr = []
        p.fill(colors[i])
        p.beginShape()
        for (const ang in arr) {
          const rad = p.radians(ang)
          const newRadius =
            spacing + arr[ang] + getNoise(rad, i * noise_delta) * magnitude

          p.vertex(newRadius * p.cos(rad), newRadius * p.sin(rad))
          new_arr[ang] = newRadius
        }
        p.beginContour()
        for (const ang in arr) {
          const rad = p.radians(359 - ang)
          p.vertex(arr[359 - ang] * p.cos(rad), arr[359 - ang] * p.sin(rad))
        }
        p.endContour()

        p.endShape(p.CLOSE)

        arr = new_arr
      }
    }

    function getNoise(radian, dim) {
      let r = radian % p.TAU
      if (r < 0.0) {
        r += p.TAU
      }
      return p.noise(
        ox + p.cos(r) * (noise_radius + dim / 200),
        oy + p.sin(r) * (noise_radius + dim / 200),
        dim
      )
    }
  }

  return <P5Wrapper sketch={sketch} theme={theme} />
}

export default Topography
