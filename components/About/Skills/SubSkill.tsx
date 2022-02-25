import styles from './Skills.module.scss'
import classnames from 'classnames'
import Icon from 'components/Icon'
import externalLink from 'eva-icons/fill/svg/external-link.svg'
import { getSkillLevel, getLoveLevel } from './levels'
import { SubSkillProps } from './types'

const SubSkill = ({
  knowledge = 0,
  love = 0,
  name,
  href = null,
}: SubSkillProps) => {
  const loveLevel = getLoveLevel(love)
  const skillLevel = getSkillLevel(knowledge)

  return (
    <li className={styles.subskill}>
      <span className={styles.subskill__name}>{name}</span>
      {!!love && (
        <span
          title={`Opinion: ${loveLevel.name}`}
          className={styles.subskill__icon}
        >
          {loveLevel.emoji}
        </span>
      )}
      {!!knowledge && (
        <span
          title={`Knowledge: ${skillLevel.name}`}
          className={styles.subskill__icon}
        >
          {skillLevel.emoji}
        </span>
      )}
      {!!href && (
        <a
          href={href}
          title={`More info on ${name}`}
          className={classnames(styles.link, styles.subskill__icon)}
        >
          <Icon icon={externalLink} />
        </a>
      )}
    </li>
  )
}

export default SubSkill
