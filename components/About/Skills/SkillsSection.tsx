import Section, { SubSection } from '../Section'
import Skill from './Skill'
import skills from './skills-data'
import styles from './Skills.module.scss'

const SkillsSection = () => (
  <Section title="Skills" contentClassName={styles.skills}>
    {skills.map((section) =>
      section.skills.map((skill) => (
        <Skill key={`skill-${skill.name}`} {...skill} />
      ))
    )}
  </Section>
)

export default SkillsSection
