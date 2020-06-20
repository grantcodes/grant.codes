import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { mixin, palette } from '../../Theme/helpers'

const size = 32

const Marker = styled.div`
  display: block;
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  overflow: hidden;
  transition: border-color 0.2s var(--color-complementary);
  border: 1px solid;
  left: ${({ left }) => left - size / 2}px;
  top: ${({ top }) => top - size / 2}px;
  width: ${size}px;
  height: ${size}px;
  box-shadow: ${mixin.shadow(1)}
    ${({ highlight }) =>
      !!highlight &&
      `
    box-shadow: 0 0 0.2em var(--color-contrast);
    z-index: 2;
  `}
    img {
    display: block;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
  }
`

const AvatarMarker = ({ image, alt, ...props }) => (
  <Marker {...props}>
    <img src={image} alt={alt} />
  </Marker>
)

AvatarMarker.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  highlight: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
}

AvatarMarker.defaultProps = {
  image: process.env.NEXT_PUBLIC_AUTHOR_PHOTO,
  alt: 'A marker showing ' + process.env.NEXT_PUBLIC_AUTHOR_NAME,
  highlight: false,
}

export default AvatarMarker
