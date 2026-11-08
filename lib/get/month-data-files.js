import fs from 'fs'
import { join } from 'path'

export default function getMonthDataFiles() {
  const files = []

  const dataDir = join(process.cwd(), 'data', 'monthly')
  const dir = fs.opendirSync(dataDir)
  let yearFolder
  while ((yearFolder = dir.readSync()) !== null) {
    const yearDir = fs.opendirSync(join(dataDir, yearFolder.name))
    let monthFile
    while ((monthFile = yearDir.readSync()) !== null) {
      files.push(join(yearFolder.name, monthFile.name.replace('.json', '')))
    }
    yearDir.closeSync()
  }
  dir.closeSync()

  return files
}
