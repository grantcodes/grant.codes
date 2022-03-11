import Section, { SubSection } from '../Section'
import Skill from './Skill'
import skills from './skills-data'

const SkillsSection = () => (
  <Section title="Skills">
    {skills.map((section) => (
      <SubSection title={section.name} key={`section-${section.name}`}>
        {section.skills.map((skill) => (
          <Skill key={`skill-${skill.name}`} {...skill} />
        ))}
      </SubSection>
    ))}
  </Section>
)

export default SkillsSection
