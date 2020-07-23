import Error from '../pages/_error'

const RequireLogin = ({ children, statusCode = 404 }) => {
  let loggedIn = false

  if (loggedIn) {
    return children
  }

  return <Error statusCode={statusCode} />
}

export default RequireLogin
