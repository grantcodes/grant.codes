'use client'

// TODO: Shouldn't really need to be a client component,
//       But it's the best way to get access to the router.

import { usePathname } from 'next/navigation'
import { Button } from 'components/Button'

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  nextText: string
  previousText: string
  style?: React.StyleHTMLAttributes<any>
  noNext: boolean
}

const Pagination = ({
  nextText,
  previousText,
  noNext,
  ...props
}: PaginationProps) => {
  const pathname = usePathname()

  // TODO: This code is really gross but it works.
  let page = 1

  if (pathname?.includes('/page/')) {
    const pagePathIndex = pathname.indexOf('/page/')
    let pageString = pathname.substring(pagePathIndex + 6)
    if (pageString.includes('/')) {
      pageString = pageString.split('/')[0]
    }
    page = parseInt(pageString)
  }

  const next = page + 1
  const previous = page - 1
  const nextPath = pathname?.includes(`/page/${page}`)
    ? pathname.replace(`/page/${page}`, `/page/${next}`)
    : `${pathname}/page/${next}`.replace('//', '/')
  const previousPath =
    previous > 1 && pathname?.includes(`/page/${page}`)
      ? pathname.replace(`/page/${page}`, `/page/${previous}`)
      : pathname?.includes('/page/2')
      ? pathname.replace('/page/2', '')
      : ''

  return (
    <nav className='pagination' {...props}>
      {!!previous ? (
        <Button to={previousPath}>{previousText}</Button>
      ) : (
        // Spacer to make sure next is always on the right
        <span />
      )}
      {!noNext && !!nextPath && <Button to={nextPath}>{nextText}</Button>}
    </nav>
  )
}

Pagination.defaultProps = {
  nextText: 'Older',
  previousText: 'Newer',
  noNext: false,
  params: {},
}

export default Pagination
