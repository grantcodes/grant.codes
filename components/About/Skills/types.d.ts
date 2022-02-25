import React from 'react'

export interface SubSkillProps {
  name: string
  href?: string
  love?: number
  knowledge?: number
}

export interface SkillProps extends SubSkillProps {
  description?: React.ReactNode
  subSkills?: SubSkillProps[]
  className?: string
}
