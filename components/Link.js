import Link from 'next/link'

const WrappedLink = ({ to = null, as = null, linkAs = null, ...props }) => {
  if (!to) {
    return props.children
  }

  if (
    to.startsWith(process.env.NEXT_PUBLIC_URL) ||
    to.startsWith('https://grant.codes')
  ) {
    to = to.replace(process.env.NEXT_PUBLIC_URL, '')
    to = to.replace('https://grant.codes', '')

    if (!as && !linkAs && to.split('/').length === 5) {
      linkAs = to
      to = '/[typeOrYear]/[month]/[day]/[slug]'
    }
  }

  if (to === '') {
    to = '/'
  }

  if (to.startsWith('http')) {
    return <a href={to} {...props} />
  }

  return <Link href={to} as={linkAs || as} {...props}></Link>
}

export default WrappedLink
