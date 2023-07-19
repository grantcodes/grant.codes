'use client'
import { useState, useEffect } from 'react'
import Profile from 'components/About/Profile'
import getLastLocation, { LocationResult } from 'lib/get/last-location'

const AboutProfile = () => {
  const [lastLocation, setLastLocation] = useState<
    LocationResult | null | false
  >(null)

  useEffect(() => {
    getLastLocation()
      .then(setLastLocation)
      .catch((err) => setLastLocation(false))
  }, [])

  return <Profile location={lastLocation} />
}

export default AboutProfile
