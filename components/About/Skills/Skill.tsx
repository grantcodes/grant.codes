import { useState } from 'react'
import styles from './Skills.module.scss'
import classnames from 'classnames'
import Button from 'components/Button'
import Card from 'components/Card'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
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
  const id = `skill-${name.toLowerCase().replace(/\s/g, '-')}`

  return (
    // @ts-ignore
    <Card className={classnames(styles.skill, className)}>
      <h4 className={classnames('p-skill', styles.name)}>
        <span>{name}</span>
      </h4>

      {!!knowledge && (
        <>
          Knowledge{' '}
          <Tooltip
            id={id + 'skill'}
            text={skillLevel.name}
            // @ts-ignore
            style={{ display: 'inline' }}
            className="hide-print"
          >
            {skillLevel.emoji}
          </Tooltip>
          <progress className={styles.progress} value={knowledge} max="100" />
        </>
      )}

      {!!love && (
        <Tooltip
          id={id + 'love'}
          text={`Opinion: ${loveLevel.name}`}
          className={classnames(styles.love, 'hide-print')}
        >
          {loveLevel.emoji}
        </Tooltip>
      )}

      <div
        className={styles.skillDetails}
        style={{
          height: isOpen ? 'auto' : 0,
          overflow: isOpen ? 'visible' : 'hidden',
        }}
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
        {/* @ts-ignore */}
        <Button floating onClick={(e) => setIsOpen(!isOpen)}>
          {isOpen ? 'Less▴' : 'More▾'}
        </Button>

        {!!href && (
          <Tooltip
            text={`More info on ${name}`}
            id={id + 'more'}
            className={styles.footer__link}
          >
            <a href={href} title={`More info on ${name}`}>
              <Icon icon={externalLink} />
            </a>
          </Tooltip>
        )}
      </footer>
    </Card>
  )
}

export default Skill
