'use client'
import { useState, useEffect } from 'react'
import { SubSection } from 'components/About/Section'
import InPerson from 'components/About/InPerson'
import getLastLocation from 'lib/get/last-location'

const AboutInPerson = () => {
  const [lastLocation, setLastLocation] = useState(null)

  useEffect(() => {
    getLastLocation()
      .then(setLastLocation)
      .catch(err => setLastLocation(false))
  }, [])
  return (
    <SubSection title='In Person'>
      <InPerson location={lastLocation} />
    </SubSection>
  )
}

export default AboutInPerson
