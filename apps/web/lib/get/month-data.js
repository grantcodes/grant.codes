import fs from 'fs'
import { join } from 'path'

export default function getMonthData(year, month) {
  try {
    const filePath = join(
      process.cwd(),
      'data',
      'monthly',
      parseInt(year).toString(),
      parseInt(month) + '.json'
    )
    const jsonString = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(jsonString)
    return data
  } catch (err) {
    console.error(`[Error getting ${year}/${month} data file]`, err)
    return null
  }
}
