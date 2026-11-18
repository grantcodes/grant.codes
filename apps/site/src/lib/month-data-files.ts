import fs from 'fs'
import { join } from 'path'

const getMonthDataFiles = (dataDir?: string): string[] => {
  const files: string[] = []

  const baseDir = dataDir || join(process.cwd(), 'data', 'monthly')

  let dir
  try {
    dir = fs.opendirSync(baseDir)
  } catch {
    // data directory doesn't exist yet
    return files
  }

  let yearFolder: fs.Dirent | null
  while ((yearFolder = dir.readSync()) !== null) {
    if (!yearFolder.isDirectory()) continue

    const yearDir = fs.opendirSync(join(baseDir, yearFolder.name))
    let monthFile: fs.Dirent | null
    while ((monthFile = yearDir.readSync()) !== null) {
      if (!monthFile.isFile()) continue
      files.push(
        join(yearFolder.name, monthFile.name.replace('.json', ''))
      )
    }
    yearDir.closeSync()
  }
  dir.closeSync()

  return files
}

export default getMonthDataFiles
