import fs from 'fs'
import { join } from 'path'
import { NextSeo } from 'next-seo'
import pluralize from 'pluralize'
import Card from 'components/Card'
import NewMap from 'components/NewMap'

export default ({ title, postTypes, geojson, body }) => {
  return (
    <>
      <NextSeo title={title} />
      <h1 className="page-title">Month Summary</h1>
      {!!postTypes && (
        <Card title="Posts">
          {Object.keys(postTypes).map((type) => (
            <div key={`type-${type}`}>
              <h3>
                {postTypes[type].toString()} {pluralize(type)}
              </h3>
            </div>
          ))}
        </Card>
      )}

      {!!geojson && (
        <Card title="Map">
          <div className="card__breakout">
            <NewMap geojson={geojson} />
          </div>
        </Card>
      )}

      {!!body && <Card title="Body"></Card>}
    </>
  )
}

export const getStaticProps = ({ params }) => {
  try {
    if (!params.typeOrYear || !params.month) {
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
      props: data,
    }
  } catch (err) {
    console.error('[Error getting monthly data file]', err)
    return {
      props: {},
    }
  }
}

export const getStaticPaths = () => {
  const leadingZero = (num) =>
    parseInt(num) < 10 && parseInt(num) > 0 ? `0${num}` : `${num}`

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
