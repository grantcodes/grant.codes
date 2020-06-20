import React from 'react'
import Icon from '../../Icon'
import ThemeSwitcher from '../../ThemeSwitcher'
import twitter from 'eva-icons/fill/svg/twitter.svg'
import instagram from 'eva-icons/fill/svg/camera.svg'
import email from 'eva-icons/fill/svg/email.svg'
import facebook from 'eva-icons/fill/svg/facebook.svg'
import github from 'eva-icons/fill/svg/github.svg'
import styled from 'styled-components'
import { mixin, theme } from '../../Theme/helpers'

export default () => (
  <footer className="main-footer">
    <div>
      <a
        className="main-footer__icon"
        href={'mailto:' + process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
        rel="me"
      >
        <Icon icon={email} />
        <span className="screen-reader-text">Email</span>
      </a>
      {!!process.env.NEXT_PUBLIC_AUTHOR_TWITTER && (
        <a
          className="main-footer__icon"
          href={process.env.NEXT_PUBLIC_AUTHOR_TWITTER}
          rel="me"
        >
          <Icon icon={twitter} />
          <span className="screen-reader-text">Twitter</span>
        </a>
      )}
      {!!process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK && (
        <a
          className="main-footer__icon"
          href={process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK}
          rel="me"
        >
          <Icon icon={facebook} />
          <span className="screen-reader-text">Facebook</span>
        </a>
      )}
      {!!process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM && (
        <a
          className="main-footer__icon"
          href={process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM}
          rel="me"
        >
          <Icon icon={instagram} />
          <span className="screen-reader-text">Instagram</span>
        </a>
      )}
      {!!process.env.NEXT_PUBLIC_AUTHOR_GITHUB && (
        <a
          className="main-footer__icon"
          href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB}
          rel="me"
        >
          <Icon icon={github} />
          <span className="screen-reader-text">Github</span>
        </a>
      )}
    </div>
    <p className="h-card screen-reader-text">
      <span className="p-name">{process.env.NEXT_PUBLIC_AUTHOR_NAME}</span>
      <br />
      <a href={process.env.NEXT_PUBLIC_URL} className="u-url">
        {process.env.NEXT_PUBLIC_SITE_NAME}
      </a>
      <a
        className="u-email"
        href={'mailto:' + process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
      >
        {process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
      </a>
      <data className="u-photo" value={process.env.NEXT_PUBLIC_AUTHOR_PHOTO} />
    </p>
    <ThemeSwitcher />
  </footer>
)
