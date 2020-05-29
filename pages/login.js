import auth from 'lib/auth'

const Login = ({ redirect }) => {
  if (typeof window !== 'undefined' && redirect) {
    window.location = redirect
  }
  return null
}

export const getServerSideProps = async ({ res }) => {
  const redirect = await auth.getAuthUrl('code', ['create', 'update', 'delete'])
  if (redirect && res && res.writeHead) {
    res.writeHead(302, { Location: redirect })
    res.end()
  }
  return { redirect }
}

export default Login
