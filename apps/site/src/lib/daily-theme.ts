import { daily } from '@grantcodes/themer'

/** CSS custom properties for today's @grantcodes/themer palette (the live site's daily colours). */
export function dailyThemeVars(): Record<string, string> {
  const theme = daily()
  const vars: Record<string, string> = {
    '--day-main': theme.main,
    '--day-main-alt': theme.mainAlt,
    '--day-compl': theme.complementary,
    '--day-on-main': theme.contrast,
  }
  theme.gradient.forEach((color: string, i: number) => {
    vars[`--day-gradient-${i}`] = color
  })
  return vars
}

export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
