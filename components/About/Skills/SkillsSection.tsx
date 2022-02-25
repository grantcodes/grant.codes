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
    {/* <SubSection title="JavaScript">
              <li className="p-skill">
                <a href="https://webpack.js.org/">Webpack</a>
              </li>
              <li className="p-skill">
                <a href="https://p5js.org/">p5.js</a>
              </li>
            </ul>
          </SubSection>

          <SubSection title="HTML"></SubSection>

          <SubSection title="Other Stuff I'd be Happy to Work With">
            <ul>
              <li>
                <a href="https://getkirby.com/">Kirby</a>
              </li>
              <li>
                <a href="https://craftcms.com/">Craft CMS</a>
              </li>
              <li>
                <a href="https://facebook.github.io/react-native/">
                  React Native
                </a>
              </li>
              <li>Headless CMS</li>
              <li>
                <a href="https://shopify.com">Shopify</a>
              </li>
              <li>
                <a href="https://ghost.org">Ghost</a>
              </li>
              <li>
                <a href="https://strapi.io">Strapi</a>
              </li>
            </ul>
          </SubSection> */}
  </Section>
)

export default SkillsSection
