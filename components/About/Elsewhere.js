import React, { Fragment } from 'react'
import Icon from '../Icon'
import Map from '../Map'

import linkIcon from 'eva-icons/fill/svg/external-link.svg'
import twitterIcon from 'eva-icons/fill/svg/twitter.svg'
import githubIcon from 'eva-icons/fill/svg/github.svg'
import facebookIcon from 'eva-icons/fill/svg/facebook.svg'
import instagramIcon from 'eva-icons/fill/svg/camera.svg'
import emailIcon from 'eva-icons/fill/svg/email.svg'
import pinIcon from 'eva-icons/fill/svg/pin.svg'
import homeIcon from 'eva-icons/fill/svg/home.svg'
import workIcon from 'eva-icons/fill/svg/briefcase.svg'

import styles from 'css/pages/about.module.scss'

const userify = (url) => {
  url = new URL(url)
  let username = url.pathname
  if (
    username.startsWith('/') &&
    (username.match(new RegExp('/', 'g')) || []).length === 1
  ) {
    username = '@' + username.slice(1)
  }
  return username
}

const Profile = ({ name, icon, children }) => (
  <>
    <dt>
      <Icon icon={icon} /> {name}
    </dt>
    <dd>{children}</dd>
  </>
)

const Elsewhere = ({ location }) => (
  <dl className={styles.profiles}>
    <Profile name="Website" icon={linkIcon}>
      <a href="https://grant.codes" className="u-url">
        grant.codes
      </a>
    </Profile>

    <Profile name="Email" icon={emailIcon}>
      <a
        className="u-email"
        href={'mailto:' + process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
        rel="me"
      >
        {process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
      </a>
    </Profile>

    {!!process.env.NEXT_PUBLIC_AUTHOR_TWITTER && (
      <Fragment>
        <Profile name="Twitter" icon={twitterIcon}>
          <a href={process.env.NEXT_PUBLIC_AUTHOR_TWITTER} rel="me">
            {userify(process.env.NEXT_PUBLIC_AUTHOR_TWITTER)}
          </a>
        </Profile>
      </Fragment>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK && (
      <Fragment>
        <Profile name="Facebook" icon={facebookIcon}>
          <a href={process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK} rel="me">
            {userify(process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK)}
          </a>
        </Profile>
      </Fragment>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM && (
      <Fragment>
        <Profile name="Instagram" icon={instagramIcon}>
          <a href={process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM} rel="me">
            {userify(process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM)}
          </a>
        </Profile>
      </Fragment>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_GITHUB && (
      <Fragment>
        <Profile name="Github" icon={githubIcon}>
          <a href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB} rel="me">
            {userify(process.env.NEXT_PUBLIC_AUTHOR_GITHUB)}
          </a>
        </Profile>
      </Fragment>
    )}

    <Profile name="Home address" icon={homeIcon}>
      Barrio La Latina, Madrid, Spain
    </Profile>

    <Profile name="Work Address" icon={workIcon}>
      I work in a lovely coworking space called{' '}
      <a href="https://quintadelsordo.com/">Quinta del Sordo</a>
    </Profile>

    {!!location && (
      <Profile name="Last Seen" icon={pinIcon}>
        {!!location.addr && <p>{location.addr}</p>}
        <Map
          location={`geo:${location.lat},${location.lon}`}
          defaultWidth={500}
          defaultHeight={250}
          style={{ width: '25em', maxWidth: '100%', height: '12.5em' }}
          themed
        />
      </Profile>
    )}
  </dl>
)

export default Elsewhere
