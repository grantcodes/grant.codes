import classnames from 'classnames'
import Link from '../Link'
import Icon from '../Icon'
import React from 'react'
import { LinkProps } from 'next/link'

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon?: string
  children: React.ReactNode
  floating?: boolean
  to?: string
  as?: LinkProps['as']
}

const Button = ({
  children,
  icon,
  floating = false,
  ...props
}: ButtonProps) => {
  const El = !!props.to ? Link : 'button'

  // TODO: Fix types
  return (
    // @ts-ignore
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
