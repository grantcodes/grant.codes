import React from 'react'

export interface SubSkillProps {
  name: string
  href?: string
  love?: number
  knowledge?: number
  id?: string
}

export interface SkillProps extends SubSkillProps {
  description?: React.ReactNode
  subSkills?: SubSkillProps[]
  className?: string
}
