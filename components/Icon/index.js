import classnames from 'classnames'

const Icon = ({ icon, className = '' }) => (
  <span
    className={classnames('icon', className)}
    dangerouslySetInnerHTML={{
      __html: icon,
    }}
  />
)

export default Icon
