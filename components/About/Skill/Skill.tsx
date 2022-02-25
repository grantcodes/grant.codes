import styles from './Skill.module.scss'
import classnames from 'classnames'
import Card from 'components/Card'
import Icon from 'components/Icon'
import externalLink from 'eva-icons/fill/svg/external-link.svg'

interface SkillProps {
  knowledge: number
  love: number
  name: string
  href?: string
  children?: React.ReactNode
  subSkills: SkillProps[]
}

interface Level {
  emoji: string
  name: string
  start: number
}
const loveLevels: Array<Level> = [
  {
    start: 0,
    emoji: '🤢',
    name: 'Hate it',
  },
  {
    start: 20,
    emoji: '👎',
    name: 'Not a fan',
  },
  {
    start: 50,
    emoji: '👍',
    name: "It's ok",
  },
  {
    start: 70,
    emoji: '🥰',
    name: "I'm a fan",
  },
  {
    start: 90,
    emoji: '💖',
    name: 'I love it',
  },
]

const skillLevels: Array<Level> = [
  {
    start: 0,
    emoji: '👷‍♂️',
    name: 'Used it one time',
  },
  {
    start: 20,
    emoji: '👨‍🔬',
    name: 'Experimenting',
  },
  {
    start: 50,
    emoji: '🧑‍💻',
    name: 'Decent',
  },
  {
    start: 70,
    emoji: '🧑‍🏫',
    name: 'Experienced',
  },
  {
    start: 90,
    emoji: '🦸‍♂️',
    name: 'Expert',
  },
]

const getSkillLevel = (value: number): Level => {
  for (const skillLevel of skillLevels.reverse()) {
    if (value >= skillLevel.start) {
      return skillLevel
    }
  }
}

const getLoveLevel = (value: number): Level => {
  for (const loveLevel of loveLevels.reverse()) {
    if (value >= loveLevel.start) {
      return loveLevel
    }
  }
}

const Skill = ({
  knowledge = 0,
  love = 0,
  name,
  href = null,
  subSkills = [],
  children,
}: SkillProps) => {
  const loveLevel = getLoveLevel(love)
  const skillLevel = getSkillLevel(knowledge)

  return (
    <Card className={styles.skill}>
      <h4 className={classnames('p-skill', styles.name)}>
        {name}

        {!!href && (
          <a href={href}>
            <Icon icon={externalLink} />
            <span className="screen-reader-text">More info on {name}</span>
          </a>
        )}
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

      {children}

      {subSkills.map((skill) => (
        <span>{skill.name}</span>
      ))}
    </Card>
  )
}

export default Skill
