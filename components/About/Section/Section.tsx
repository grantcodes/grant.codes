import styles from './Section.module.scss'
import cx from 'classnames'

interface AboutSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

const AboutSection = ({ title, children, className }: AboutSectionProps) => {
  return (
    <section className={cx(styles.section, className)}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </section>
  )
}

export default AboutSection
