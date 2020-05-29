import React, { Fragment, useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from '../../Link'
import Search from './Search'
import isAdmin from '../../../lib/is-admin'
import { theme, palette, mixin } from '../../Theme/helpers'

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  grid-area: nav;
  position: fixed;
  left: 100%;
  top: 0;
  bottom: 0;
  overflow: auto;
  transform: ${(props) =>
    props.targeted ? 'translateX(-100%)' : 'translateX(0%)'};
  transition: transform 0.4s;
  padding: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;
  width: 18rem;
  max-width: 100%;
  z-index: 9;
  font-size: 2em;
  box-shadow: ${mixin.shadow()};
  ${mixin.glass()}
  &:target {
    transform: translateX(-100%);
  }
  @media (min-width: ${theme('midBreak')}) {
    body:not(.single-article) & {
      font-size: 1rem;
      padding: 0;
      position: sticky;
      align-items: flex-start;
      justify-content: flex-start;
      right: auto;
      background: none;
      backdrop-filter: none;
      box-shadow: none;
      transform: none;
      z-index: 1;
      width: auto;
      top: calc(${theme('headerHeight')} + 2rem);
      bottom: auto;
      max-height: calc(
        100vh - ${theme('headerHeight')} - ${theme('headerHeight')} - 4rem
      );
    }
    .container.right-aligned & {
      justify-self: end;
      align-items: flex-end;
    }
    .container.single-article & {
      position: fixed;
    }
  }

  @media print {
    display: none;
  }
`

const NavToggle = styled.a`
  text-decoration: none;
  position: fixed;
  top: 0;
  right: 0;
  width: 2.5rem;
  height: 2.5rem;
  padding: ${(2.5 - 1) / 2}rem;
  text-align: center;
  line-height: 1rem;
  ${mixin.glass()}
  z-index: 10;
  box-shadow: ${mixin.shadow()};
  opacity: 0.9;
  border-bottom-left-radius: ${theme('borderRadius')};
  border-left: 1px solid ${palette('mainBorder')};
  border-bottom: 1px solid ${palette('mainBorder')};
  cursor: pointer;
  display: block;
  @media (min-width: ${theme('midBreak')}) {
    display: none;
    .container.single-article & {
      display: block;
    }
  }

  @media print {
    display: none;
  }
`

const NavLink = styled(Link)`
  display: inline-block;
  text-shadow: ${mixin.shadow(1)};
  font-size: ${mixin.fs(2)};
  @media (min-width: ${theme('midBreak')}) {
    display: ${(props) => (props.hidden ? 'none' : 'block')};
    margin-bottom: 0.2em;
    font-size: ${mixin.fs(1)};
    ${Nav}:target & {
      display: block;
    }
  }

  ${Nav}:target & {
    display: inline-block;
  }
`

const More = styled(NavLink)`
  display: none;
  @media (min-width: ${theme('midBreak')}) {
    display: block;
  }
  ${Nav}:target & {
    display: none;
  }
`

const Webring = styled(NavLink).attrs((props) => ({ as: 'div' }))`
  display: block;
  white-space: nowrap;
`

const shownLinkCount = 4

export default () => {
  const [targeted, setTargeted] = useState(false)
  const [moreHidden, setMoreHidden] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [search, setSearch] = useState('')
  // Reload on mount to update absolute urls
  useEffect(() => {
    setTargeted(targeted)
    setShowSearch(true)
  }, [])

  const navLinks = [
    {
      text: 'About',
      to: '/about',
      // TODO: Want this to be subdomain
    },
    {
      text: 'Contact',
      to: '/contact',
    },
    {
      text: 'Projects',
      to: '/websites',
    },
    {
      text: 'Updates',
      to: '/',
    },
    {
      text: 'Likes',
      to: '/[typeOrYear]',
      as: '/likes',
    },
    {
      text: 'Photos',
      to: '/[typeOrYear]',
      as: '/photos',
    },
    {
      text: 'Galleries',
      to: '/[typeOrYear]',
      as: '/collections',
    },
    {
      text: 'Replies',
      to: '/[typeOrYear]',
      as: '/replies',
    },
  ]

  if (isAdmin) {
    navLinks.push(
      {
        text: 'Events',
        to: '/[typeOrYear]',
        as: '/events',
      },
      {
        text: 'Watched',
        to: '/[typeOrYear]',
        as: '/watches',
      },
      {
        text: 'Journal',
        to: '/[typeOrYear]',
        as: '/journal',
      },
      {
        text: 'Drafts',
        to: '/drafts',
      },
      {
        text: 'Trash',
        to: '/trash',
      }
    )
  }

  return (
    <Fragment>
      <NavToggle
        href="#nav"
        aria-hidden="true"
        title="menu"
        onClick={(e) => {
          e.preventDefault()
          setTargeted(!targeted)
        }}
      >
        {targeted ? 'x' : '<'}
      </NavToggle>

      <Nav targeted={targeted} id="nav">
        {navLinks.map((link, i) => (
          <Fragment key={'nav-link-to-' + i}>
            {i === shownLinkCount && (
              <More
                to="#nav"
                onClick={(e) => {
                  e.preventDefault()
                  setMoreHidden(!moreHidden)
                }}
              >
                {moreHidden ? 'More...' : 'Less...'}
              </More>
            )}
            <NavLink
              to={link.to}
              linkAs={link.as}
              hidden={i >= shownLinkCount && moreHidden}
            >
              {link.text}
            </NavLink>
          </Fragment>
        ))}

        <Search />

        {!!process.env.NEXT_PUBLIC_INDIEWEBRING_ID && (
          <Webring>
            <a
              title="Previous IndieWeb site"
              href={`https://xn--sr8hvo.ws/${process.env.NEXT_PUBLIC_INDIEWEBRING_ID}/previous`}
            >
              <span role="img" aria-label="Previous IndieWeb site">
                👈
              </span>
            </a>
            <span
              title="An IndieWeb webring"
              role="img"
              aria-label="An IndieWeb webring"
            >
              🕸💍
            </span>
            <a
              title="Next IndieWeb site"
              href={`https://xn--sr8hvo.ws/${process.env.NEXT_PUBLIC_INDIEWEBRING_ID}/next`}
            >
              <span role="img" aria-label="Next IndieWeb site">
                👉
              </span>
            </a>
          </Webring>
        )}
      </Nav>
    </Fragment>
  )
}
