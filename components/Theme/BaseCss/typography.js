import { createGlobalStyle } from 'styled-components'
import normalWoff2 from 'circular-std/fonts/CircularStd-Book.woff2'
import normalWoff from 'circular-std/fonts/CircularStd-Book.woff'
import italicWoff2 from 'circular-std/fonts/CircularStd-BookItalic.woff2'
import italicWoff from 'circular-std/fonts/CircularStd-BookItalic.woff'
import boldWoff2 from 'circular-std/fonts/CircularStd-Black.woff2'
import boldWoff from 'circular-std/fonts/CircularStd-Black.woff'
import { palette, mixin, theme } from '../helpers'

const fontSans = `"CircularStd", -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif`
const fontMono = `'DejaVu Sans Mono', Menlo, Consolas, 'Liberation Mono', Monaco, 'Lucida Console', monospace`

export default createGlobalStyle`
*,
*:before,
*:after {
  -webkit-font-smoothing: inherit;
}


body {
  color: ${palette('contrast')};
  fill: ${palette('contrast')};
  transition: color ${theme('themeTransitionTime')};
  line-height: 1.5;
  font-size: 120%;
  font-family: ${fontSans};
  word-wrap: break-word;
  -webkit-font-smoothing: antialiased;
}


@font-face{
  font-family: "CircularStd";
  src: url(${normalWoff2}) format("woff2"), url(${normalWoff}) format("woff");
  font-style: normal;
  font-weight: normal;
  font-display: fallback;
}

@font-face{
  font-family: "CircularStd";
  src: url(${italicWoff2}) format("woff2"), url(${italicWoff}) format("woff");
  font-style: italic;
  font-weight: normal;
  font-display: fallback;
}

@font-face{
  font-family: "CircularStd";
  src: url(${boldWoff2}) format("woff2"), url(${boldWoff}) format("woff");
  font-style: normal;
  font-weight: bold;
  font-display: fallback;
}

p {
  margin: 0;
  margin-bottom: ${mixin.space()};
  margin-top: ${mixin.space()};
}

h1,
h2,
h3,
h4,
h5,
h6 {
  line-height: 1.2;
}

h1 {
  font-size: ${mixin.fs(4)};
  margin-top: ${mixin.space()};
  margin-bottom: ${mixin.space(2)};
}
h2 {
  font-size: ${mixin.fs(3)};
  margin-bottom: ${mixin.space(2)};
}
h3 {
  font-size: ${mixin.fs(2)};
  margin-bottom: ${mixin.space(1)};
}
h4 {
  font-size: ${mixin.fs(1)};
  margin-bottom: ${mixin.space(1)};
}
h5 {
  font-size: ${mixin.fs(0)};
}
h6 {
  font-size: ${mixin.fs(-1)};
}

small {
  font-size: ${mixin.fs(-1)};
}


ul,
ol {
  padding-left: ${mixin.space()};
  margin-top: ${mixin.space()};
  margin-bottom: ${mixin.space()};
}

blockquote {
  display: block;
  text-align: left;
  border-left: 0.2rem solid;
  background: ${palette('main')};
  padding: ${mixin.space()} ${mixin.space(2)};
  font-style: italic;

  footer {
    font-size: 0.7em;
    font-style: normal;
  }
}

pre {
  code {
    display: block;
  }
  font-family: ${fontMono};
  display: block;
  font-size: 0.9rem;
  width: 100%;
  overflow: auto;
  background-color: ${palette('main')};
  padding: ${theme('cardPadding')};
}

code {
  font-family: ${fontMono};
  p & {
    padding-left: 0.5em;
    padding-right: 0.5em;
    border-radius: 0.3rem;
    font-size: 0.9em;
    display: inline-block;
    background-color: ${palette('main')};
    border: 1px solid ${palette('main')};
  }
}

hr {
  display: block;
  border: none;
  text-align: center;
  line-height: 0;
  overflow: visible;
  margin-top: ${mixin.space(2)};
  margin-bottom: ${mixin.space(2)};
}
hr::after {
  display: inline-block;
  text-decoration: line-through wavy;
  content: '\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0';
  @media (min-width: 30em) {
    content: '\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0';
  }
}
`
