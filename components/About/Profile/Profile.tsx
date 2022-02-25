import Avatar from '../../Avatar'
import styles from './Profile.module.scss'

const Profile = (props) => {
  return (
    <div {...props} className={styles.profile}>
      <div className={styles.photo}>
        <Avatar
          size={400}
          author={{
            name: 'Grant Richmond',
            photo: '/img/me.jpg',
            url: 'https://grant.codes',
          }}
          noName
          noLink
          noProxy
        />
      </div>
      <div className={styles.content}>
        <h1 className="page-title">Hi! I'm Grant 👋</h1>
        <p className={styles.profile__description}>
          I'm a Scottish web developer, currently based in Barcelona.
        </p>
        <p className={styles.profile__description}>
          I like to make, fun, usable websites.
        </p>
      </div>
    </div>
  )
}

export default Profile
