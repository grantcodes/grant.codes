import styles from './Online.module.scss'
import Icon from 'components/Icon'
import Card from 'components/Card'
import Tooltip from 'components/Tooltip'

import linkIcon from 'eva-icons/fill/svg/external-link.svg'
import twitterIcon from 'eva-icons/fill/svg/twitter.svg'
import githubIcon from 'eva-icons/fill/svg/github.svg'
import facebookIcon from 'eva-icons/fill/svg/facebook.svg'
import instagramIcon from 'eva-icons/fill/svg/camera.svg'
import emailIcon from 'eva-icons/fill/svg/email.svg'

const userify = (urlString: string): string => {
  const url = new URL(urlString)
  let username = url.pathname
  if (
    username.startsWith('/') &&
    (username.match(new RegExp('/', 'g')) || []).length === 1
  ) {
    username = '@' + username.slice(1)
  }
  return username
}

interface ProfileProps {
  href: string
  name: string
  icon: string
  className?: string
  rel?: string
}

const Profile = ({ href, name, icon, ...props }: ProfileProps) => (
  <Tooltip text={name} id={`online-${icon}`}>
    <Card className={styles.card} style={{ margin: 0 }}>
      <a href={href} {...props} title={name}>
        <Icon icon={icon} className={styles.icon} />
        <span className="screen-reader-text">{name}</span>
      </a>
    </Card>
  </Tooltip>
)

const Online = () => (
  <div className={styles.online}>
    <Profile
      name="Website grant.codes"
      icon={linkIcon}
      href="https://grant.codes"
      className="u-url"
    ></Profile>

    <Profile
      name={`Email ${process.env.NEXT_PUBLIC_AUTHOR_EMAIL}`}
      icon={emailIcon}
      className="u-email"
      href={'mailto:' + process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
      rel="me"
    ></Profile>

    {!!process.env.NEXT_PUBLIC_AUTHOR_TWITTER && (
      <Profile
        name={`Twitter ${userify(process.env.NEXT_PUBLIC_AUTHOR_TWITTER)}`}
        icon={twitterIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_TWITTER}
        rel="me"
      ></Profile>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK && (
      <Profile
        name={`Facebook ${userify(process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK)}`}
        icon={facebookIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK}
        rel="me"
      ></Profile>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM && (
      <Profile
        name={`Instagram ${userify(process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM)}`}
        icon={instagramIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM}
        rel="me"
      ></Profile>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_GITHUB && (
      <Profile
        name={`Github ${userify(process.env.NEXT_PUBLIC_AUTHOR_GITHUB)}`}
        icon={githubIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB}
        rel="me"
      ></Profile>
    )}
  </div>
)

export default Online
