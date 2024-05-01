import PostList from 'components/PostList'
import { DataSummary } from 'components/DataSummary'
import getTypes from 'lib/get/post-types'
import getMonthData from 'lib/get/month-data'
import getMonthDataFiles from 'lib/get/month-data-files'
import getPosts from 'lib/get/posts'

interface YearData {
  year: number
  postTypes?: { [key: string]: number }
  geojson?: any
  body?: { [key: string]: string[] }
}

async function getYearData (year): Promise<YearData> {
  // Is a year archive.
  let yearData: YearData = {
    year,
  }
  for (let month = 1; month < 13; month++) {
    const monthData = getMonthData(year, month)
    if (!monthData) {
      continue
    }

    // Merge post type counts
    if (monthData.postTypes) {
      if (!yearData.postTypes) {
        yearData.postTypes = monthData.postTypes
      } else {
        for (const postType in monthData.postTypes) {
          if (monthData.postTypes.hasOwnProperty(postType)) {
            const count = monthData.postTypes[postType]
            yearData.postTypes[postType] = !yearData.postTypes[postType]
              ? count
              : yearData.postTypes[postType] + count
          }
        }
      }
    }

    // Merge geojson paths
    if (monthData.geojson) {
      if (!yearData.geojson) {
        yearData.geojson = monthData.geojson
      } else {
        try {
          yearData.geojson.geometry.coordinates.push(
            ...monthData.geojson.geometry.coordinates
          )
        } catch (err) {
          console.warn(`[Error merging ${year}/${month} geojson]`, err)
        }
      }
    }

    // Merge body data
    if (monthData.body) {
      if (!yearData.body) {
        yearData.body = monthData.body
      } else {
        for (const key in monthData.body) {
          if (monthData.body.hasOwnProperty(key)) {
            const values = monthData.body[key]
            if (!yearData.body[key]) {
              yearData.body[key] = []
            }
            yearData.body[key].push(...values)
          }
        }
      }
    }
  }

  return { ...yearData }
}

const Page = async ({ params }) => {
  if (parseInt(params.typeOrYear)) {
    // Is a year summary.
    const yearInt = parseInt(params.typeOrYear)
    const yearData = await getYearData(yearInt)
    const nextLink = `/${yearInt + 1}`
    const previousLink = `/${yearInt - 1}`
    return (
      <DataSummary
        {...yearData}
        title={`Year Summary ${yearInt}`}
        pagination={{
          previous: {
            // to: '/[typeOrYear]',
            to: previousLink,
          },
          next: {
            // to: '/[typeOrYear]',
            to: nextLink,
          },
        }}
      />
    )
  } else {
    // Is a type archive.
    const posts = await getPosts({
      query: { ...params },
    })
    return <PostList posts={posts} type="home" params={params} />
  }
}

// export async function generateStaticParams () {
//   try {
//     // Get post types to create type archives
//     const ingoredTypes = ['photos', 'journals']
//     let types = await getTypes(true)
//     types = types.filter(type => !ingoredTypes.includes(type))

//     // Get year data folders to create year archives
//     const monthFiles = getMonthDataFiles()
//     const years: string[] = []
//     for (const file of monthFiles) {
//       let [year] = file.split('/')
//       if (!years.includes(year)) {
//         years.push(year)
//       }
//     }
//     types.push(...years)

//     // Create both post type and year paths
//     return types.map(t => ({ typeOrYear: t }))
//   } catch (err) {
//     console.error('Error getting typeoryear static paths', err)
//     return [
//       { typeOrYear: 'notes' },
//       { typeOrYear: 'articles' },
//       { typeOrYear: 'photos' },
//       { typeOrYear: 'likes' },
//       { typeOrYear: 'replies' },
//     ]
//   }
// }

export { generateMetadata } from 'lib/get/metadata'

export default Page
