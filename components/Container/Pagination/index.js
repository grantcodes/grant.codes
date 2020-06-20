import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Button from '../../Button'
import { mixin } from '../../Theme/helpers'

const Wrapper = styled.nav`
  clear: both;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${mixin.space(1)};
`

const Pagination = ({ nextText, previousText, noNext, ...props }) => {
  let {
    asPath,
    route,
    query: { page = 1 },
  } = useRouter()

  const next = parseInt(page) + 1
  const previous = parseInt(page) - 1

  if (!asPath.includes('/page/')) {
    asPath += '/page/' + page
    route += '/page/[page]'
  }

  return (
    <Wrapper {...props}>
      {previous > 0 ? (
        <Button
          to={route}
          linkAs={asPath.replace('page/' + page, 'page/' + previous)}
        >
          {previousText}
        </Button>
      ) : (
        // Spacer to make sure next is always on the right
        <span />
      )}
      {!noNext && !!next && (
        <Button
          to={route}
          linkAs={asPath.replace('page/' + page, 'page/' + next)}
        >
          {nextText}
        </Button>
      )}
    </Wrapper>
  )
}

Pagination.propTypes = {
  nextText: PropTypes.string.isRequired,
  previousText: PropTypes.string.isRequired,
  style: PropTypes.object,
  noNext: PropTypes.bool.isRequired,
}

Pagination.defaultProps = {
  nextText: 'Older',
  previousText: 'Newer',
  noNext: false,
  style: {},
}

export default Pagination
