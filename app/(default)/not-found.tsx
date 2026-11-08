const NotFound = ({ statusCode = 404 }) => (
  <>
    <h1 className='page-title'>{statusCode}</h1>
    <p>What you were looking for isn't here anymore</p>
  </>
)

export default NotFound
