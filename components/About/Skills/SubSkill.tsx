import styles from './Skills.module.scss'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import externalLink from 'eva-icons/fill/svg/external-link.svg'
import { getLoveLevel } from './levels'
import { SubSkillProps } from './types'

const SubSkill = ({
  knowledge = 0,
  love = 0,
  name,
  href = null,
}: SubSkillProps) => {
  const loveLevel = getLoveLevel(love)
  const id = `subskill-${name.toLowerCase().replace(/\s/g, '-')}`

  return (
    <li className={styles.subskill}>
      <span className={styles.subskill__name}>{name}</span>
      {!!href && (
        <Tooltip
          text={`More info on ${name}`}
          id={id + 'more'}
          className={styles.subskill__icon}
        >
          <a href={href} className={styles.link}>
            <Icon icon={externalLink} />
          </a>
        </Tooltip>
      )}
      {!!love && (
        <Tooltip
          text={`Opinion: ${loveLevel.name}`}
          id={id + 'love'}
          className={styles.subskill__icon}
        >
          {loveLevel.emoji}
        </Tooltip>
      )}
    </li>
  )
}

export default SubSkill
