import React from 'react'
import Icon from './Icon'
import twitter from '../svgs/twitter.svg'
import facebook from '../svgs/facebook.svg'
import instagram from '../svgs/instagram.svg'
import google from '../svgs/google-plus.svg'
import github from '../svgs/github.svg'
import telegram from '../svgs/telegram.svg'

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
  return new URL(url).hostname
}
