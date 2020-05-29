// import React from 'react'
// import { Link as DynamicLink } from 'react-router-dom'
// import styled from 'styled-components'
// import isNode from '@postr/core/lib/is-node'
// // import useIsSyncing from '../hooks/use-is-syncing'
// import getIsSubdomain from '../lib/is-subdomain'

// const isSubdomain =
//   typeof window !== 'undefined' && getIsSubdomain(window.location.hostname)

// const Link = ({ to = null, ...props }) => {
//   if (!to) {
//     // Broken link
//     // console.warn('Broken link', props)
//     return <span {...props} />
//   }

//   // const isSyncing = useIsSyncing()

//   // Remove the siteurl to get paths
//   to = to.replace(process.env.NEXT_PUBLIC_URL, '')
//   if (to === '') {
//     to = '/'
//   }

//   // If on a subdomain or syncing or to external page then use a regurlar link
//   if (isSubdomain || isNode || to.startsWith('http')) {
//     if (!to.startsWith('http')) {
//       to = process.env.NEXT_PUBLIC_URL + to
//     }
//     return <a href={to} {...props} />
//   }

//   // Use react router link
//   return <DynamicLink to={to} {...props} />
// }

// export default styled(Link)``

import Link from 'next/link'

export default ({ to = null, as = null, linkAs = null, ...props }) => {
  if (!to) {
    return props.children
  }

  to = to.replace(process.env.NEXT_PUBLIC_URL, '')
  to = to.replace('https://grant.codes', '')
  if (to === '') {
    to = '/'
  }

  if (to.startsWith('http')) {
    return <a href={to} {...props} />
  }

  return (
    <Link href={to} as={linkAs || as}>
      <a {...props}></a>
    </Link>
  )
}
