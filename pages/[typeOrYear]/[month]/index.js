import fs from 'fs'
import { join } from 'path'
import { NextSeo } from 'next-seo'
import pluralize from 'pluralize'
import Card from 'components/Card'
import Map from 'components/Map'
import Overlay from 'pigeon-overlay'
// import geojson2svg from 'geojson2svg'
import geojson2svg from 'geojson-to-svg'
import ReactMapGL, { Source, Layer } from 'react-map-gl'
import NewMap from 'components/NewMap'

// const converter = geojson2svg({})

const MapRoute = ({
  mapState: { width, height },
  latLngToPixel,
  geojson,
  style = { stroke: 'rgb(255,0,0)', strokeWidth: 2 },
}) => {
  const mapSvg = geojson
    ? // ? geojson2svg().data(geojson).extent([-160, -100, 160, 100]).render()
      geojson2svg().data(geojson).render()
    : null
  console.log({ geojson, mapSvg })
  return (
    <Overlay
      // style={{ top: 0, left: 0 }}
      anchor={geojson.features[0].geometry.coordinates}
    >
      <div
        width={width}
        height={height}
        className="map-route"
        dangerouslySetInnerHTML={{ __html: mapSvg }}
      ></div>
    </Overlay>
  )
}

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
            {/* <Map>
              <MapRoute geojson={geojson} />
            </Map> */}
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
