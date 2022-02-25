import styles from './Online.module.scss'
import Icon from 'components/Icon'
import Card from 'components/Card'

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
  children: React.ReactNode
  className?: string
  rel?: string
}

const Profile = ({ href, name, icon, children, ...props }: ProfileProps) => (
  <Card className={styles.card} style={{ margin: 0 }}>
    <a href={href} {...props} title={name}>
      <Icon icon={icon} className={styles.icon} />
      <span className="screen-reader-text">{name}</span>
      <span className="screen-reader-text">{children}</span>
    </a>
  </Card>
)

const Online = () => (
  <div className={styles.online}>
    <Profile
      name="Website"
      icon={linkIcon}
      href="https://grant.codes"
      className="u-url"
    >
      grant.codes
    </Profile>

    <Profile
      name="Email"
      icon={emailIcon}
      className="u-email"
      href={'mailto:' + process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
      rel="me"
    >
      {process.env.NEXT_PUBLIC_AUTHOR_EMAIL}
    </Profile>

    {!!process.env.NEXT_PUBLIC_AUTHOR_TWITTER && (
      <Profile
        name="Twitter"
        icon={twitterIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_TWITTER}
        rel="me"
      >
        {userify(process.env.NEXT_PUBLIC_AUTHOR_TWITTER)}
      </Profile>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK && (
      <Profile
        name="Facebook"
        icon={facebookIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK}
        rel="me"
      >
        {userify(process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK)}
      </Profile>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM && (
      <Profile
        name="Instagram"
        icon={instagramIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM}
        rel="me"
      >
        {userify(process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM)}
      </Profile>
    )}

    {!!process.env.NEXT_PUBLIC_AUTHOR_GITHUB && (
      <Profile
        name="Github"
        icon={githubIcon}
        href={process.env.NEXT_PUBLIC_AUTHOR_GITHUB}
        rel="me"
      >
        {userify(process.env.NEXT_PUBLIC_AUTHOR_GITHUB)}
      </Profile>
    )}
  </div>
)

export default Online
