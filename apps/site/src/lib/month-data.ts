import fs from 'fs'
import { join } from 'path'

const getMonthData = (
  year: string | number,
  month: string | number,
  dataDir?: string
): any | null => {
  try {
    const baseDir =
      dataDir || join(process.cwd(), 'data', 'monthly')
    const filePath = join(
      baseDir,
      parseInt(year as string).toString(),
      parseInt(month as string) + '.json'
    )
    const jsonString = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(jsonString)
  } catch (err) {
    console.error(`[Error getting ${year}/${month} data file]`, err)
    return null
  }
}

export default getMonthData
