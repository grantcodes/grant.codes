import classnames from 'classnames'
import Link from '../Link'
import Icon from '../Icon'
import React from 'react'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: string
  children: React.ReactNode
  floating?: boolean
  to?: string
}

const Button = ({
  children,
  icon,
  floating = false,
  ...props
}: ButtonProps) => {
  const El = !!props.to ? Link : 'button'

  return (
    <El
      className={classnames('button', props.className, {
        'button--floating': floating,
        'button--icon': icon,
      })}
      {...props}
    >
      {icon ? <Icon icon={icon} /> : null}
      {children}
    </El>
  )
}

export type { ButtonProps }
export { Button }
