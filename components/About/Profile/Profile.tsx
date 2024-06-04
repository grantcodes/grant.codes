import classnames from 'classnames'
import Avatar from '../../Avatar'
import styles from './Profile.module.scss'

interface ProfileProps {
  vertical?: boolean
}

const Profile = ({ vertical = false }: ProfileProps) => {
  console.log({ vertical })
  const wrapperClass = classnames(styles.profile, {
    [styles['profile--vertical']]: vertical,
  })

  return (
    <div className={wrapperClass}>
      <div className={styles.photo}>
        <Avatar
          size={400}
          author={{
            name: process.env.NEXT_PUBLIC_AUTHOR_NAME,
            photo: process.env.NEXT_PUBLIC_AUTHOR_PHOTO,
            url: process.env.NEXT_PUBLIC_URL,
          }}
          noName
          noLink
          noProxy
        />
      </div>
      <div className={styles.content}>
        <h1 className="page-title">Hi! I'm Grant 👋</h1>
        <p className={styles.profile__description}>
          I'm a frontend engineer, orginally from Scotland, currently based in
          Barcelona
        </p>
        <p className={styles.profile__description}>
          I like to make fun, accessible, sustainable websites
        </p>
      </div>
    </div>
  )
}

export default Profile
