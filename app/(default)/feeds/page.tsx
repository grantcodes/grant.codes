import pluralize from 'pluralize'
import Card from 'components/Card'
import getCategories from 'lib/get/categories'
import getPostTypes from 'lib/get/post-types'

const baseUrl = process.env.NEXT_PUBLIC_MICROPUB_URL + '/plugin/feeds'
const feedTypes = [
  { id: 'atom', name: 'Atom' },
  { id: 'rss', name: 'RSS' },
  { id: 'json', name: 'JSON Feed' },
  { id: 'jf2', name: 'JSON Feed 2' },
  { id: 'mf2json', name: 'Microformats 2 JSON' },
]

async function getData () {
  const postTypes = await getPostTypes()
  const categories = await getCategories()
  return { postTypes, categories }
}

const Feeds = async () => {
  const { postTypes, categories } = await getData()

  return (
    <>
      <h1 className='page-title'>Feeds</h1>

      <Card title='Main Feeds'>
        <ul>
          {feedTypes.map(ft => (
            <li key={`main-${ft.id}`}>
              <a href={`${baseUrl}/${ft.id}`}>{ft.name}</a>
            </li>
          ))}
        </ul>
      </Card>

      <Card title='Type Feeds'>
        {postTypes.map(pt => (
          <details key={`post-type-${pt}`}>
            <summary style={{ textTransform: 'capitalize' }}>
              {pluralize(pt)}
            </summary>

            <ul>
              {feedTypes.map(ft => (
                <li key={`post-type-${pt}-${ft.id}`}>
                  <a href={`${baseUrl}/${ft.id}/type/${pt}`}>{ft.name}</a>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </Card>

      <Card title='Category Feeds'>
        {categories.map(cat => (
          <details key={`cat-${cat}`}>
            <summary>{cat.name}</summary>

            <ul>
              {feedTypes.map(ft => (
                <li key={`cat-${cat.slug}-${ft.id}`}>
                  <a href={`${baseUrl}/${ft.id}/category/${cat.slug}`}>
                    {ft.name}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </Card>
    </>
  )
}

export default Feeds

export const metadata = {
  title: 'Feeds',
}
