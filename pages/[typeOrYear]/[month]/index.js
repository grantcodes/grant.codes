import fs from 'fs'
import { join } from 'path'
import { NextSeo } from 'next-seo'
import classnames from 'classnames'
import pluralize from 'pluralize'
import Card from 'components/Card'
import LeafletMap from 'components/LeafletMap'
import Button from 'components/Button'
import styles from 'css/pages/monthly-summary.module.scss'

const leadingZero = (num) =>
  parseInt(num) < 10 && parseInt(num) > 0 ? `0${num}` : `${num}`

const MonthlySummary = ({ year, month, postTypes, geojson, body }) => {
  const yearInt = parseInt(year)
  const monthInt = parseInt(month)
  const nextLink = `/${monthInt === 12 ? yearInt + 1 : year}/${
    monthInt === 12 ? '01' : leadingZero(monthInt) + 1
  }`
  const previousLink = `/${monthInt === 1 ? yearInt - 1 : year}/${
    month === 1 ? 12 : leadingZero(monthInt - 1)
  }`

  return (
    <>
      <NextSeo title={`Monthly Summary ${year}/${month}`} />
      <h1 className="page-title">
        Monthly Summary {year}/{month}
      </h1>
      {!!postTypes && (
        <Card title="Posts">
          <ul className={classnames('card__breakout', styles.counts)}>
            {Object.keys(postTypes).map((type) => (
              <li className={styles.counts__count} key={`type-${type}`}>
                <span className={styles.counts__count__number}>
                  {postTypes[type].toString()}
                </span>
                <h3 className={styles.counts__count__type}>
                  {postTypes[type] > 1 ? pluralize(type) : type}
                </h3>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {!!geojson && (
        <Card title="Map">
          <div className="card__breakout">
            <LeafletMap geojson={geojson} />
          </div>
        </Card>
      )}

      {!!body && <Card title="Body"></Card>}

      <nav className="pagination">
        <Button to="/[typeOrYear]/[month]" linkAs={previousLink}>
          Previous
        </Button>
        <Button to="/[typeOrYear]/[month]" linkAs={nextLink}>
          Next
        </Button>
      </nav>
    </>
  )
}

export const getStaticProps = ({ params }) => {
  try {
    if (
      !params.typeOrYear ||
      !params.month ||
      !parseInt(params.typeOrYear) ||
      !parseInt(params.month)
    ) {
      throw new Error('Year or month is not defined')
    }

    const filePath = join(
      process.cwd(),
      'data',
      'monthly',
      parseInt(params.typeOrYear).toString(),
      parseInt(params.month) + '.json'
    )
    const jsonString = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(jsonString)
    return {
      props: {
        year: params.typeOrYear,
        month: params.month,
        ...data,
      },
    }
  } catch (err) {
    console.error('[Error getting monthly data file]', err)
    return {
      props: {},
    }
  }
}

export const getStaticPaths = () => {
  const paths = []

  const dataDir = join(process.cwd(), 'data', 'monthly')
  const dir = fs.opendirSync(dataDir)
  let yearFolder
  while ((yearFolder = dir.readSync()) !== null) {
    const yearDir = fs.opendirSync(join(dataDir, yearFolder.name))
    let monthFile
    while ((monthFile = yearDir.readSync()) !== null) {
      paths.push({
        params: {
          year: yearFolder.name,
          month: leadingZero(monthFile.name.replace('.json', '')),
          typeOrYear: yearFolder.name,
        },
      })
    }
    yearDir.closeSync()
  }
  dir.closeSync()

  return {
    paths,
    fallback: false,
  }
}

export default MonthlySummary
