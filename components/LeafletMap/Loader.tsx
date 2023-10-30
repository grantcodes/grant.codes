'use client'

import dynamic from 'next/dynamic'

const LeafletMap = dynamic(
  () => import('./LeafletMap').then(mod => mod.LeafletMap),
  {
    ssr: false,
    loading: () => <div>Loading map...</div>,
  }
)

const Loader = props => {
  return <LeafletMap {...props} />
}

export { Loader }
