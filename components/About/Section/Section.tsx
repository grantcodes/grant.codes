import styles from './Section.module.scss'

const AboutSection = ({ title, children }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </section>
  )
}

export default AboutSection
