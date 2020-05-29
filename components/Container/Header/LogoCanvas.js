import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import chroma from 'chroma-js'
import P5Wrapper from 'react-p5-wrapper'

const width = 400
const height = 109
const colorCount = 5

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.fullHeight ? 'center' : 'flex-start')};
  width: 100%;
  ${(props) =>
    props.fullHeight
      ? `
    min-height: 100vh;
    min-height: calc(100vh - 5rem);
  `
      : null}

  canvas {
    display: block;
    width: 100% !important;
    max-width: ${(props) => (props.fullHeight ? 30 : 20)}rem;
    height: auto !important;
  }
  @media (min-width: ${theme('midBreak')}) {
    width: auto;
    display: inline-flex;
    align-items: flex-start;
    height: ${theme('headerHeight')}};
    min-height: 0;

    canvas {
      width: auto !important;
      max-height: ${theme('headerHeight')}} !important;
      max-width: 100%;
    }
  }
`

const Topography = ({
  fullHeight = typeof window !== 'undefined' &&
    window.location.pathname === '/',
}) => {
  const theme = useContext(ThemeContext)

  const sketch = function (p) {
    // let baseColor = chroma.random()
    let baseColor = chroma(theme.palette.main)
    baseColor =
      baseColor.get('hsl.l') < 0.5
        ? baseColor.set('hsl.l', '.7')
        : baseColor.set('hsl.l', '.3')
    baseColor = baseColor.set('hsl.h', '+90')
    let colors = chroma
      // .scale([theme.palette.complementary, theme.palette.main])
      .scale([baseColor, chroma(baseColor).set('hsl.h', '+180')])
      .mode('lab')
      .colors(colorCount)

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
      p.textAlign(p.CENTER, p.CENTER)
      p.textStyle(p.BOLD)
      p.textFont('CircularStd')
    }

    p.draw = function () {
      // p.translate(width, 0)
      display()
    }

    // p.mousePressed = () => {
    //   const newColor = chroma.random()
    //   colors = chroma
    //     // .scale([theme.palette.complementary, theme.palette.main])
    //     .scale([newColor, chroma(newColor).set('hsl.h', '+180')])
    //     .mode('lch')
    //     .colors(colorCount)
    //   display()
    // }

    function display() {
      let topG = p.createGraphics(width, height)
      topG.noStroke()
      topG.fill(theme.palette.main)
      topG.rect(0, 0, width, height)

      let arr = []
      ox = p.random(10000)
      oy = p.random(10000)
      for (let i = 0; i < 360; i++) {
        arr.push(p.random(1))
      }
      let i = 0
      for (const color of colors) {
        let new_arr = []
        topG.fill(color)
        topG.beginShape()
        for (const ang in arr) {
          const rad = p.radians(ang)
          const newRadius =
            spacing + arr[ang] + getNoise(rad, i * noise_delta) * magnitude

          topG.vertex(newRadius * p.cos(rad), newRadius * p.sin(rad))
          new_arr[ang] = newRadius
        }
        topG.beginContour()
        for (const ang in arr) {
          const rad = p.radians(359 - ang)
          topG.vertex(arr[359 - ang] * p.cos(rad), arr[359 - ang] * p.sin(rad))
        }
        topG.endContour()

        topG.endShape(p.CLOSE)

        arr = new_arr
        i++
      }

      let textG = p.createGraphics(width, height)
      const textString = process.env.NEXT_PUBLIC_SITE_NAME
      const baseTextSize = width / textString.length
      textG.noStroke()
      textG.fill(0)
      textG.textAlign(p.CENTER, p.CENTER)
      textG.textStyle(p.BOLD)
      textG.textFont('CircularStd')
      textG.textSize(baseTextSize)
      // Fit text to canvas size
      const textSize = p.min(
        (baseTextSize * width) / textG.textWidth(textString),
        height
      )
      textG.textSize(textSize)
      textG.text(textString, width / 2, height / 2)

      // Add squiggly above the text
      const squiggleSize = textSize / 8
      const squiggleWidth = squiggleSize * 1.5
      textG.noFill()
      textG.stroke(0)
      textG.strokeWeight(squiggleSize)
      textG.beginShape()
      let x = squiggleSize
      const y = height / 2 - textSize / 2 - squiggleSize
      textG.vertex(x, y)
      let even = false
      while (x < width - squiggleSize) {
        x += squiggleWidth
        textG.quadraticVertex(
          x - squiggleWidth / 2,
          even ? y + squiggleSize : y - squiggleSize,
          x,
          y
        )
        even = !even
      }
      textG.endShape()

      let topImg = p.createImage(width, height)
      topImg.copy(topG, 0, 0, width, height, 0, 0, width, height)
      let textImg = p.createImage(width, height)
      textImg.copy(textG, 0, 0, width, height, 0, 0, width, height)

      topImg.mask(textImg)
      p.image(topImg, 0, 0)
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

  return (
    <Wrapper fullHeight={fullHeight}>
      <P5Wrapper sketch={sketch} theme={theme} />
    </Wrapper>
  )
}

export default Topography
