'use client'

import React, { useState } from 'react'
import classnames from 'classnames'
import Link from '../../Link'
import Search from './Search'
import Icon from 'components/Icon'
// import useContext from 'lib/hooks/use-context'
import menuIcon from 'eva-icons/fill/svg/menu.svg'
import closeIcon from 'eva-icons/fill/svg/close.svg'

const shownLinkCount = 4

const Nav = () => {
  const [targeted, setTargeted] = useState(false)
  const [moreHidden, setMoreHidden] = useState(true)
  // TODO: Admin functionality.
  // const { isAdmin } = useContext()
  const isAdmin = false

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
    <>
      <a
        className="main-nav-toggle"
        href="#nav"
        aria-hidden="true"
        title="menu"
        onClick={(e) => {
          e.preventDefault()
          setTargeted(!targeted)
        }}
      >
        <Icon icon={targeted ? closeIcon : menuIcon} />
      </a>

      <nav
        id="nav"
        className={classnames('main-nav', { 'is-target': targeted })}
      >
        <ul className="main-nav__ul">
          {navLinks.map((link, i) => (
            <li className="main-nav__li" key={'nav-link-to-' + i}>
              {i === shownLinkCount && (
                <a
                  className="main-nav__link main-nav__link--more"
                  to="#nav"
                  onClick={(e) => {
                    e.preventDefault()
                    setMoreHidden(!moreHidden)
                  }}
                >
                  {moreHidden ? 'More...' : 'Less...'}
                </a>
              )}
              <Link
                to={link.to}
                linkAs={link.as}
                className={classnames('main-nav__link', {
                  'main-nav__link--hidden': i >= shownLinkCount && moreHidden,
                })}
                onClick={(e) => {
                  setTargeted(false)
                  return true
                }}
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>

        <Search />

        {!!process.env.NEXT_PUBLIC_INDIEWEBRING_ID && (
          <div className="main-nav__link main-nav__link--webring">
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
          </div>
        )}
      </nav>
    </>
  )
}

export default Nav
