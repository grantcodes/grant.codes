import classnames from 'classnames'
import moment from 'moment'
import styles from 'css/pages/about.module.scss'

const Event = ({
  place,
  start,
  end = null,
  title,
  children,
  links = [],
  className,
  ...props
}) => (
  <div className={classnames(styles.event, className)} {...props}>
    <div className={styles.event__left}>
      {!!place && (
        <h5 className={classnames(styles.event__subtitle, 'p-location')}>
          {place}
        </h5>
      )}
      <time
        className={classnames(styles.event__time, 'dt-start')}
        dateTime={moment(start).format()}
      >
        {moment(start).format('MMMM YYYY')}
      </time>{' '}
      -{' '}
      {end ? (
        <time
          className={classnames(styles.event__time, 'dt-end')}
          dateTime={moment(end).format()}
        >
          {moment(end).format('MMMM YYYY')}
        </time>
      ) : (
        'current'
      )}
    </div>
    <div className={styles.event__right}>
      <h4 className={classnames(styles.event__title, 'p-name')}>{title}</h4>
      <div className="p-summary">{children}</div>
      {links.map((link) => (
        <a href={link} key={link}>
          {new URL(link).hostname}
        </a>
      ))}
    </div>
  </div>
)

export default Event
