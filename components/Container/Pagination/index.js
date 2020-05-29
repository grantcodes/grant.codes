import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '../../Button'
import { mixin } from '../../Theme/helpers'

const Wrapper = styled.nav`
  clear: both;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${mixin.space(1)};
`

const Pagination = ({ next, previous, nextText, previousText, ...props }) => (
  <Wrapper {...props}>
    {!!previous ? (
      <Button to={previous}>{previousText}</Button>
    ) : (
      // Spacer to make sure next is always on the right
      <span />
    )}
    {!!next && <Button to={next}>{nextText}</Button>}
  </Wrapper>
)

Pagination.propTypes = {
  next: PropTypes.any,
  previous: PropTypes.any,
  nextText: PropTypes.string.isRequired,
  previousText: PropTypes.string.isRequired,
  style: PropTypes.object,
}

Pagination.defaultProps = {
  nextText: 'Older',
  previousText: 'Newer',
  style: {},
}

export default Pagination
