import classnames from 'classnames'
export default ({ icon, className }) => (
  <span
    className={classnames('icon', className)}
    dangerouslySetInnerHTML={{
      __html: icon,
    }}
  />
)
