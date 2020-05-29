import React from 'react'
import Icon from '../../Icon'
import ThemeSwitcher from '../../ThemeSwitcher'
import twitter from '../../../svgs/twitter.svg'
import instagram from '../../../svgs/instagram.svg'
import email from '../../../svgs/email.svg'
import facebook from '../../../svgs/facebook.svg'
import github from '../../../svgs/github.svg'
import styled from 'styled-components'
import { mixin, theme } from '../../Theme/helpers'

const Footer = styled.footer`
  grid-area: footer;
  justify-self: center;
  margin-top: 2rem;
  @media (min-width: ${theme('midBreak')}) {
    position: sticky;
    z-index: 1;
    align-self: end;
    justify-self: start;
    bottom: 1rem;
    .container.right-aligned & {
      justify-self: end;
    }
    .container.single-article & {
      position: static;
      justify-self: center;
    }
  }

  @media print {
    display: none;
  }
`

const FooterIcons = styled.div``

const FooterIcon = styled.a`
  padding: 0.2em;
  display: inline-block;
  text-decoration: none;
  font-size: 1.5rem;
  svg {
    filter: drop-shadow(${mixin.shadow()});
  }
`

export default () => (
  <Footer>
    <FooterIcons>
      <FooterIcon
        href={'mailto:' + process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
        rel="me"
      >
        <Icon icon={email} />
        <span className="screen-reader-text">Email</span>
      </FooterIcon>
      {!!process.env.NEXT_PUBLIC_AUTHOR_TWITTER && (
        <FooterIcon href={process.env.NEXT_PUBLIC_AUTHOR_TWITTER} rel="me">
          <Icon icon={twitter} />
          <span className="screen-reader-text">Twitter</span>
        </FooterIcon>
      )}
      {!!process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK && (
        <FooterIcon href={process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK} rel="me">
          <Icon icon={facebook} />
          <span className="screen-reader-text">Facebook</span>
        </FooterIcon>
      )}
      {!!process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM && (
        <FooterIcon href={process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM} rel="me">
          <Icon icon={instagram} />
          <span className="screen-reader-text">Instagram</span>
        </FooterIcon>
      )}
      {!!process.env.NEXT_PUBLIC_AUTHOR_GITHUB && (
        <FooterIcon href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB} rel="me">
          <Icon icon={github} />
          <span className="screen-reader-text">Github</span>
        </FooterIcon>
      )}
    </FooterIcons>
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
  </Footer>
)
