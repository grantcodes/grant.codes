import PostList from 'components/PostList'
import DataSummary from 'components/DataSummary'
import getTypes from 'lib/get/post-types'
import getMonthData from 'lib/get/month-data'
import getMonthDataFiles from 'lib/get/month-data-files'
import { getStaticProps as getPostsStaticProps } from 'lib/get/posts'

const Page = ({ posts = [], year = null, ...props }) => {
  if (year) {
    const yearInt = parseInt(year)
    const nextLink = `/${yearInt + 1}`
    const previousLink = `/${yearInt - 1}`

    return (
      <DataSummary
        {...props}
        title={`Year Summary ${year}`}
        pagination={{
          previous: {
            to: '/[typeOrYear]',
            linkAs: previousLink,
          },
          next: {
            to: '/[typeOrYear]',
            linkAs: nextLink,
          },
        }}
      />
    )
  } else {
    return <PostList posts={posts} type="home" />
  }
}

export async function getStaticProps(ctx) {
  const year = parseInt(ctx.params.typeOrYear)
  if (year) {
    // Is a year archive.
    let yearData = {}
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
              yearData.body[key].push(...values)
            }
          }
        }
      }
    }

    return { props: { year, ...yearData } }
  } else {
    return getPostsStaticProps(ctx)
  }
}

export async function getStaticPaths() {
  try {
    // Get post types to create type archives
    const ingoredTypes = ['photos', 'journals']
    let types = await getTypes(true)
    types = types.filter((type) => !ingoredTypes.includes(type))

    // Get year data folders to create year archives
    const monthFiles = getMonthDataFiles()
    const years = new Set()
    for (const file of monthFiles) {
      const [year] = file.split('/')
      years.add(year)
    }
    types.push(...years)

    // Create both post type and year paths
    return {
      paths: types.map((t) => ({ params: { typeOrYear: t } })),
      fallback: false,
    }
  } catch (err) {
    console.error('Error getting typeoryear static paths', err)
    return {
      paths: [
        { params: { typeOrYear: 'notes' } },
        { params: { typeOrYear: 'articles' } },
        { params: { typeOrYear: 'photos' } },
        { params: { typeOrYear: 'likes' } },
        { params: { typeOrYear: 'replies' } },
      ],
      fallback: false,
    }
  }
}

export default Page
