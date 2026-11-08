import classnames from 'classnames'
import styles from 'css/pages/where.module.scss'
import { WhereLocation } from './components/Location'
import type { Metadata } from 'next'

const Where = () => {
  return (
    <>
      <div className={styles.wrapper}>
        <h2 className="page-title">Where am I?</h2>

        <noscript>
          <div className={classnames('card card--glass', styles.card)}>
            Sorry, you need JS enabled to find out where I am
          </div>
        </noscript>

        <WhereLocation />
      </div>
    </>
  )
}

export const metadata: Metadata = {
  title: 'Where am I?',
  robots: {
    index: false,
  },
}

export default Where
