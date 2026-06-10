import styles from './Section.module.scss'
import cx from 'classnames'

interface AboutSubSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
  titleClassName?: string
}

const AboutSubSection = ({
  title,
  children,
  className,
  titleClassName,
}: AboutSubSectionProps) => (
  <div className={cx(styles.subsection, className)}>
    {!!title && (
      <h3 className={cx(styles.subtitle, titleClassName)}>{title}</h3>
    )}
    <div className={styles.subcontent}>{children}</div>
  </div>
)

export default AboutSubSection
