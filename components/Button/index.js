import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '../Link'
import Icon from '../Icon'
import { palette, theme, mixin } from '../Theme/helpers'

const Button = styled.button`
  display: inline-block;
  background-color: ${props =>
    props.secondary
      ? props.theme.palette.secondary
      : props.theme.palette.complementary};
  color: ${palette('contrast')};
  fill: currentColor;
  padding: 0.5em 1em;
  text-decoration: none;
  transition: background-color ${theme('themeTransitionTime')};
  border: 0;
  outline: none;
  border-radius: ${theme('borderRadius')};
  line-height: 1.2;
  font-size: 1em;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.3em;
  font-weight: bold;
  font-family: inherit;
  cursor: pointer;
  box-shadow: ${mixin.shadow()};

  :hover,
  :focus,
  :active {
    color: ${palette('main')};
    fill: ${palette('main')};
    background-color: ${palette('contrast')};
  }

  ${({ floater }) =>
    !!floater &&
    `
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
    :hover,
    :focus,
    :active {
  background-color: rgba(0, 0, 0, 0.6);
}
`}

  ${({ icon }) =>
    !!icon &&
    `
padding: 0.5em;
line-height: 1;
text-align: center;
`}
`

// .icon {
//   width: 1em;
// }

const GButton = ({ children, icon, floating, ...props }) => {
  if (icon) {
    icon = <Icon icon={icon} />
  }

  return (
    <Button as={!!props.to ? Link : null} {...props}>
      {icon}
      {children}
    </Button>
  )
}

GButton.propTypes = {
  icon: PropTypes.string,
  to: PropTypes.string,
  floating: PropTypes.bool.isRequired,
}

GButton.defaultProps = {
  floating: false,
}

export default GButton
