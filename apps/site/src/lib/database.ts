import { statSync } from 'node:fs'
import { resolve } from 'node:path'

/** The api's postr database. Set POSTR_DATABASE to read another copy. */
export const database = resolve(process.env.POSTR_DATABASE ?? '../api/.data/postr.db')

/** Changes whenever the database is written: postr writes through its WAL file and checkpoints into the main file. */
export function databaseVersion() {
  return ['', '-wal']
    .map((suffix) => {
      try {
        const { mtimeMs, size } = statSync(database + suffix)
        return `${mtimeMs}:${size}`
      } catch {
        return ''
      }
    })
    .join('|')
}
