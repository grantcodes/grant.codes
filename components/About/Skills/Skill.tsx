import { useState } from 'react'
import styles from './Skills.module.scss'
import classnames from 'classnames'
import Button from 'components/Button'
import Card from 'components/Card'
import Icon from 'components/Icon'
import SubSkill from './SubSkill'
import externalLink from 'eva-icons/fill/svg/external-link.svg'
import { getLoveLevel, getSkillLevel } from './levels'
import { SkillProps } from './types'

const Skill = ({
  knowledge = 0,
  love = 0,
  name,
  href = null,
  subSkills = [],
  description,
  className,
}: SkillProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const loveLevel = getLoveLevel(love)
  const skillLevel = getSkillLevel(knowledge)

  return (
    <Card className={classnames(styles.skill, className)}>
      <h4 className={classnames('p-skill', styles.name)}>
        <span>{name}</span>
      </h4>

      {!!knowledge && (
        <>
          Skill Level {skillLevel.emoji}
          <progress className={styles.progress} value={knowledge} max="100" />
        </>
      )}

      {!!love && (
        <>
          Love Level {loveLevel.emoji}
          <progress className={styles.progress} value={love} max="100" />
        </>
      )}

      <div
        className={styles.skillDetails}
        style={{ height: isOpen ? 'auto' : 0 }}
      >
        {!!description && description}

        {subSkills.length > 0 && (
          <ul className={styles.subskills}>
            {subSkills.map((skill) => (
              <SubSkill {...skill} />
            ))}
          </ul>
        )}
      </div>

      <footer className={classnames(styles.footer, 'hide-print')}>
        <Button floating onClick={(e) => setIsOpen(!isOpen)}>
          {isOpen ? 'Less▴' : 'More▾'}
        </Button>

        {!!href && (
          <a
            href={href}
            title={`More info on ${name}`}
            className={styles.footer__link}
          >
            <Icon icon={externalLink} />
          </a>
        )}
      </footer>
    </Card>
  )
}

export default Skill
