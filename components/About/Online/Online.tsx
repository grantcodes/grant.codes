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
  id: string
  href: string
  name: string
  icon: string
  className?: string
  rel?: string
}

const Profile = ({
  id,
  href,
  name,
  icon,
  className,
  ...props
}: ProfileProps) => (
  <Tooltip text={name} id={`online-${id}`} className={className}>
    {/* @ts-ignore */}
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
      id="web"
      name="Website grant.codes"
      icon={linkIcon}
      href="https://grant.codes"
      className="u-url hide-print"
    ></Profile>

    <Profile
      id="email"
      name={`Email ${process.env.NEXT_PUBLIC_AUTHOR_EMAIL}`}
      icon={emailIcon}
      className="u-email"
      href={'mailto:' + process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
      rel="me"
    ></Profile>

    {!!process.env.NEXT_PUBLIC_AUTHOR_TWITTER && (
      <Profile
        id="twitter"
        name={`Twitter ${userify(process.env.NEXT_PUBLIC_AUTHOR_TWITTER)}`}
        icon={twitterIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_TWITTER}
        rel="me"
        className="hide-print"
      ></Profile>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK && (
      <Profile
        id="facebook"
        name={`Facebook ${userify(process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK)}`}
        icon={facebookIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK}
        rel="me"
        className="hide-print"
      ></Profile>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM && (
      <Profile
        id="instagram"
        name={`Instagram ${userify(process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM)}`}
        icon={instagramIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM}
        rel="me"
        className="hide-print"
      ></Profile>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_GITHUB && (
      <Profile
        id="github"
        name={`Github ${userify(process.env.NEXT_PUBLIC_AUTHOR_GITHUB)}`}
        icon={githubIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB}
        rel="me"
      ></Profile>
    )}
  </div>
)

export default Online
