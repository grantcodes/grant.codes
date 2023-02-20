import emailIcon from 'eva-icons/fill/svg/email.svg'
import twitterIcon from 'eva-icons/fill/svg/twitter.svg'
import Card from 'components/Card'
import Icon from 'components/Icon'
import styles from 'css/pages/contact.module.scss'

const Contact = () => (
  <>
    <h1 className='page-title'>Get in touch!</h1>

    <Card>
      <ul className={styles.list}>
        {!!process.env.NEXT_PUBLIC_AUTHOR_EMAIL && (
          <li>
            <a href={'mailto:' + process.env.NEXT_PUBLIC_AUTHOR_EMAIL}>
              <Icon className={styles.icon} icon={emailIcon} />
              Email
            </a>
          </li>
        )}
        {!!process.env.NEXT_PUBLIC_AUTHOR_TWITTER && (
          <li>
            <a href='https://twitter.com/messages/compose?recipient_id=1121850384'>
              <Icon className={styles.icon} icon={twitterIcon} />
              Twitter DM
            </a>
          </li>
        )}
      </ul>
    </Card>
  </>
)

export default Contact

export const metadata = {
  title: 'Contact',
}
