import Error from '../pages/_error'

export default ({ children, statusCode = 404 }) => {
  let loggedIn = false

  if (loggedIn) {
    return children
  }

  return <Error statusCode={statusCode} />
}
