import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import Button from '../../Button'

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
    asPath = asPath.replace('//', '/')
    route = route.replace('//', '/')
  }

  return (
    <nav className="pagination" {...props}>
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
    </nav>
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
