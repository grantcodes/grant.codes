import Link, { LinkProps as NextLinkProps } from 'next/link'
import React from 'react'

interface LinkProps extends Omit<NextLinkProps, 'href'> {
  to?: string
  linkAs?: string | React.ReactElement
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

const WrappedLink = ({ to, as, linkAs, ...props }: LinkProps) => {
  if (!to) {
    return props.children
  }

  const publicUrl = process.env.NEXT_PUBLIC_URL ?? ''

  if (to?.startsWith(publicUrl) || to?.startsWith('https://grant.codes')) {
    to = to.replace(publicUrl, '')
    to = to.replace('https://grant.codes', '')

    if (!as && !linkAs && to.split('/').length === 5) {
      linkAs = to
      to = '/[typeOrYear]/[month]/[day]/[slug]'
    }
  }

  if (to === '') {
    to = '/'
  }

  if (to && to.startsWith('http')) {
    return <a href={to} {...props} />
  }

  // @ts-ignore
  return <Link href={to} as={linkAs || as} {...props}></Link>
}

export default WrappedLink
