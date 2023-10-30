import classnames from 'classnames'
import Avatar from '../../Avatar'
import styles from './Profile.module.scss'

const Profile = props => {
  return (
    <div {...props} className={styles.profile}>
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
        <h1 className='page-title'>Hi! I'm Grant 👋</h1>
        <p className={styles.profile__description}>
          I'm a Scottish web developer, currently based in Barcelona.
        </p>
        <p className={styles.profile__description}>
          I like to make, fun, accessible, sustainable websites.
        </p>
        <p className={classnames(styles.profile__description, 'print-only')}>
          <small style={{ display: 'block' }}>
            This CV is a printout from{' '}
            <a href='https://grant.codes/about'>https://grant.codes/about</a>{' '}
            check there for more detailed information on my skills and projects.
          </small>
        </p>
      </div>
    </div>
  )
}

export default Profile
