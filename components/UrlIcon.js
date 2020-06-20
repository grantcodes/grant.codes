import React from 'react'
import Icon from './Icon'
import twitter from 'eva-icons/fill/svg/twitter.svg'
import facebook from 'eva-icons/fill/svg/facebook.svg'
import instagram from 'eva-icons/fill/svg/camera.svg'
import google from 'eva-icons/fill/svg/google.svg'
import github from 'eva-icons/fill/svg/github.svg'
import telegram from 'eva-icons/fill/svg/paper-plane.svg'

const iconDomains = [
  {
    domain: 'twitter.com',
    icon: twitter,
  },
  {
    domain: 'facebook.com',
    icon: facebook,
  },
  {
    domain: 'instagram.com',
    icon: instagram,
  },
  {
    domain: 'google.com',
    icon: google,
  },
  {
    domain: 'github.com',
    icon: github,
  },
  {
    domain: 't.me',
    icon: telegram,
  },
]

export default ({ url }) => {
  for (const iconDomain of iconDomains) {
    if (url.indexOf(iconDomain.domain) > -1) {
      return <Icon icon={iconDomain.icon} ariaLabel={iconDomain.domain} />
    }
  }
  try {
    const hostname = new URL(url).hostname
    return hostname
  } catch (err) {
    console.warn('[Error with icon url]', err)
    return null
  }
}
