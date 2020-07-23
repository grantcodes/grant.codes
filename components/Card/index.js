import classnames from 'classnames'

const Card = ({ children, title, className }) => (
  <div className={classnames('card', className)}>
    {!!title && <h2 className="card__title">{title}</h2>}
    {children}
  </div>
)

export default Card
