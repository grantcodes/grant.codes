import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { normalize, hideVisually } from 'polished'
import Typography from './typography'
import Forms from './forms'
import Media from './media'
import { palette, theme } from '../helpers'
const widthNormal = '50rem'

const Base = createGlobalStyle`
/* ${normalize()} */

*,
*:before,
*:after {
  box-sizing: border-box;
}

html,
body,
#root {
  padding: 0;
  margin: 0;
  min-width: 260px;
}

/* GENERAL BASE */
html {
  background-color: ${palette('main')};
  color: ${palette('contrast')};
  fill: currentColor;
  transition: color ${theme('themeTransitionTime')},
  background-color ${theme('themeTransitionTime')}, fill ${theme(
  'themeTransitionTime'
)};
  position: relative;
  cursor: url(/img/cursor.png) 16 16, auto;
  cursor: -webkit-image-set(url(/img/cursor.png) 1x, url(/img/cursor-64.png) 2x) 16 16, auto;
  color: ${palette('contrast')};
}

.screen-reader-text {
  ${hideVisually()}
}


a {
  color: inherit;
  text-decoration: underline;

  :hover,
  :focus {
    text-decoration: underline wavy;
  }

  :visited {
    /* color: $link-c--visited; */
  }
}

`

// /* TODO: Rebuild with styled components */
// /* Single article style, need to rework! */
// .container.single-article {
//   .main-content > .post--article {
//     & > .card {
//       background: none;
//       box-shadow: none;
//       border: none;
//       margin: 0;
//     }
//     > .facepile,
//     > .comments {
//       display: block;
//       width: ${widthNormal};
//       max-width: 100%;
//       margin-left: auto;
//       margin-right: auto;
//       padding-left: ${theme('cardPadding')};
//       padding-right: ${theme('cardPadding')};
//     }
//   }

//   /* // Format post content */
//   .main-content > .post--article > .card {
//     > .post__header .post__title {
//       /* @extend h1;
//       @media (min-width: $mid-break) {
//         text-align: center;
//       } */
//       /* max-width: ${widthNormal}; */
//       margin-left: auto;
//       margin-right: auto;
//     }

//     > .post__header--background {
//       min-height: 50vh;
//       position: sticky;
//       top: 0;
//       z-index: 0;

//       & ~ div.e-content {
//         box-shadow: 0 -0.2rem 0.2rem rgba(0, 0, 0, 0.2);
//       }
//     }

//     > .post__footer,
//     > .post__actions {
//       margin-left: -${theme('cardPadding')};
//       margin-right: -${theme('cardPadding')};
//       @media (min-width: ${widthNormal}) {
//         max-width: 100%;
//         width: ${widthNormal};
//         margin-left: auto;
//         margin-right: auto;
//       }
//     }
//   }

export default () => (
  <>
    <Base />
    <Typography />
    <Media />
    <Forms />
  </>
)
