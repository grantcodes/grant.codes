import styles from './Skills.module.scss'
import classnames from 'classnames'
import Card from 'components/Card'
import Tooltip from 'components/Tooltip'
import SubSkill from './SubSkill'
import { getLoveLevel } from './levels'
import { SkillProps } from './types'

const Skill = ({
  love = 0,
  name,
  subSkills = [],
  description,
  className,
}: SkillProps) => {
  const loveLevel = getLoveLevel(love)
  const id = `skill-${name.toLowerCase().replace(/\s/g, '-')}`

  return (
    // @ts-ignore
    <Card className={classnames(styles.skill, className)}>
      <h4 className={classnames('p-skill', styles.name)}>
        <span>{name}</span>
      </h4>

      {!!love && (
        <Tooltip
          id={id + 'love'}
          text={`Opinion: ${loveLevel.name}`}
          className={classnames(styles.love, 'hide-print')}
        >
          {loveLevel.emoji}
        </Tooltip>
      )}

      <div className={styles.skillDetails}>
        {!!description && description}

        {subSkills.length > 0 && (
          <ul className={styles.subskills}>
            {subSkills.map((skill) => (
              <SubSkill {...skill} />
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}

export default Skill
