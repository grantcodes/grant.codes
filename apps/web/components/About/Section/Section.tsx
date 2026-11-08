import styles from './Section.module.scss'
import cx from 'classnames'

interface AboutSectionProps {
  title: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
  titleClassName?: string
}

const AboutSection = ({
  title,
  children,
  className,
  contentClassName,
  titleClassName,
}: AboutSectionProps) => {
  return (
    <section className={cx(styles.section, className)}>
      <h2 className={cx(styles.title, titleClassName)}>{title}</h2>
      <div className={cx(styles.content, contentClassName)}>{children}</div>
    </section>
  )
}

export default AboutSection
