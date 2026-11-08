import classnames from 'classnames'

interface CardProps {
  children: React.ReactNode
  title?: string
  className?: string
}

const Card = ({ children, title, className }: CardProps) => (
  <div className={classnames('card', className)}>
    {!!title && <h2 className='card__title'>{title}</h2>}
    {children}
  </div>
)

export default Card
