import Avatar from '../Avatar'
import styles from 'css/pages/about.module.scss'

const Profile = (props) => {
  return (
    <div {...props}>
      <div className={styles['profile__avatar-marker']}>
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
      <h1 className="page-title">Hi! I'm Grant 👋</h1>
      <p className={styles.profile__description}>
        I'm a Scottish web developer, currently based in Barcelona.
      </p>
      <p className={styles.profile__description}>
        I like to make, fun, usable websites.
      </p>
    </div>
  )
}

export default Profile
