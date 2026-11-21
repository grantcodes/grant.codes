// Bundled with the server build, so the files are found whatever the process's working directory.
const files = import.meta.glob<any>('../../data/monthly/*/*.json', { import: 'default' })

const keyOf = (path: string) => path.match(/(\d+)\/(\d+)\.json$/)!.slice(1).join('/')
const loaders = new Map(Object.entries(files).map(([path, load]) => [keyOf(path), load]))

/** `year/month` keys of the months that have a data file. */
export const monthDataKeys = [...loaders.keys()]

/** The month's generated data (location track and more), or null when there is none. */
export async function getMonthData(year: number, month: number): Promise<any | null> {
  return (await loaders.get(`${year}/${month}`)?.()) ?? null
}
