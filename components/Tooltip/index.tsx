import { useState } from 'react'
import classnames from 'classnames'
import styles from './Tooltip.module.scss'

interface TooltipProps {
  children: React.ReactNode
  id: string
  text: string
  className?: string
}

const Tooltip = ({ children, id, text, className, ...props }: TooltipProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div
      aria-describedby={id}
      onClick={() => setOpen(!open)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={classnames(styles.anchor, className)}
      {...props}
    >
      {children}
      <span
        id={id}
        className={styles.tooltip}
        role="tooltip"
        hidden={!open}
        style={{ display: open ? 'block' : 'none' }}
      >
        {text}
      </span>
    </div>
  )
}

export default Tooltip
