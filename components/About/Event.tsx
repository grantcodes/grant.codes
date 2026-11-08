import classnames from 'classnames'
import moment from 'moment'
import styles from './Section/Section.module.scss'

interface EventProps {
  place: string
  start: Date
  end?: Date
  title: string
  children: React.ReactNode
  links?: string[]
  className?: string
}

const Event = ({
  place,
  start,
  end,
  title,
  children,
  links = [],
  className,
  ...props
}: EventProps) => (
  <div className={classnames(styles.subsection, className)} {...props}>
    <div className={styles.subtitle}>
      <h4 className="p-name">{title}</h4>
      {!!place && <h5 className="p-location">{place}</h5>}
      <time className="dt-start" dateTime={moment(start).format()}>
        {moment(start).format('MMMM YYYY')}
      </time>{' '}
      -{' '}
      {end ? (
        <time className="dt-end" dateTime={moment(end).format()}>
          {moment(end).format('MMMM YYYY')}
        </time>
      ) : (
        <time dateTime={moment(new Date()).format()}>current</time>
      )}
    </div>
    <div className={styles.subcontent}>
      <div className="p-summary">{children}</div>
      {links.map((link) => (
        <a href={link} key={link} className="hide-print">
          {new URL(link).hostname}
        </a>
      ))}
    </div>
  </div>
)

export default Event
