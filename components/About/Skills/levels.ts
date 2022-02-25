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
].reverse()

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
].reverse()

const getSkillLevel = (value: number): Level => {
  for (const skillLevel of skillLevels) {
    if (value >= skillLevel.start) {
      return skillLevel
    }
  }
}

const getLoveLevel = (value: number): Level => {
  for (const loveLevel of loveLevels) {
    if (value >= loveLevel.start) {
      return loveLevel
    }
  }
}

export { getLoveLevel, getSkillLevel }
