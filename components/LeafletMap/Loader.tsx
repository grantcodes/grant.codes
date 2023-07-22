'use client'

import dynamic from 'next/dynamic'

const Loader = (props) => {
  const LeafletMap = dynamic(
    import('./LeafletMap').then((mod) => mod.LeafletMap),
    { ssr: false }
  )

  return <LeafletMap {...props} />
}

export { Loader }
