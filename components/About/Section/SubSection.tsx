import styles from './Section.module.scss'

const AboutSubSection = ({ title, children }) => {
  return (
    <div className={styles.subsection}>
      <h3 className={styles.subtitle}>{title}</h3>
      <div className={styles.subcontent}>{children}</div>
    </div>
  )
}

export default AboutSubSection
