import Card from 'components/Card'
import getCategories from 'lib/get/categories'
import Link from 'components/Link'

const Page = async () => {
  const categories = await getCategories()

  return (
    <>
      <h1 className='page-title'>Categories</h1>

      <Card>
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <ul>
            {categories.map(({ name, slug }) => (
              <li key={`category-${slug}`}>
                <Link to={`/category/${slug}`}>{name}</Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}

export default Page
