import classnames from 'classnames'

export default ({ children, title, className }) => (
  <div className={classnames('card', className)}>
    {!!title && <h2 class="card__title">{title}</h2>}
    {children}
  </div>
)
