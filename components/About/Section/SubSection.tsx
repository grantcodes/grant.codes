import styles from './Section.module.scss'
import classnames from 'classnames'

interface AboutSubSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
}

const AboutSubSection = ({
  title,
  children,
  className,
}: AboutSubSectionProps) => (
  <div className={classnames(styles.subsection, className)}>
    {!!title && <h3 className={styles.subtitle}>{title}</h3>}
    <div className={styles.subcontent}>{children}</div>
  </div>
)

export default AboutSubSection
