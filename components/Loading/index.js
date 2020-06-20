import React from 'react'
import styled, { keyframes } from 'styled-components'
import { palette } from '../Theme/helpers'

const width = 0.25

const animation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  80%,
  100% {
    transform: translateX(${(1 / width) * 100}%);
  }
`

const Loading = styled.div`
  display: block;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  text-align: center;
  overflow: hidden;
  z-index: 10;
  height: 0.4rem;
  pointer-events: none;

  ::after {
    content: '';
    display: block;
    height: 0.4rem;
    border-radius: 0.2rem;
    width: ${100 * width}%;
    background-color: var(--color-contrast);
    opacity: 0.8;
    position: absolute;
    bottom: 0;
    left: 0;
    will-change: transform;
    animation: ${animation} 2.5s infinite linear;
  }
`

export default Loading
