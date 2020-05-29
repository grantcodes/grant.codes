import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
img {
  max-width: 100%;
  height: auto;
}

figure {
  position: relative;
  display: block;
  margin: 0;
  margin-bottom: 1rem;
}

figcaption {
  padding: 1rem 1rem 0 1rem;
  font-size: 1rem;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

figure img {
  display: block;
  width: 100%;
}

/* PostrChild embeds */
.postrchild-oembed > * {
  position: relative;
  display: block;
  margin: 0 auto;
}

.postrchild-oembed[data-postrchild-oembed-url*='youtube.'] {
  /* @include scut-ratio-box(16/9); */
  /* TODO: Make the ratio box */
  iframe {
    width: 100%;
    height: 100%;
    /* @include scut-fill(); */
  }
}
`
