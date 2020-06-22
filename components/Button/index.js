import PropTypes from 'prop-types'
import classnames from 'classnames'
import Link from '../Link'
import Icon from '../Icon'

const Button = ({ children, icon, floating, ...props }) => {
  if (icon) {
    icon = <Icon icon={icon} />
  }

  const El = !!props.to ? Link : 'button'

  return (
    <El
      className={classnames('button', props.className, {
        'button--floating': floating,
        'button--icon': icon,
      })}
      {...props}
    >
      {icon}
      {children}
    </El>
  )
}

Button.propTypes = {
  icon: PropTypes.string,
  to: PropTypes.string,
  floating: PropTypes.bool.isRequired,
}

Button.defaultProps = {
  floating: false,
}

export default Button
