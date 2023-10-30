import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styles from 'css/components/toast.module.scss'

const notificationTimeout = 3000

const Toast = ({ notification, type }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = (text, type) => {
    setNotifications([...notifications, { type, text }])
    setTimeout(
      () => setNotifications(notifications.filter((n) => n.text !== text)),
      notificationTimeout
    )
  }

  useEffect(() => {
    if (notification) {
      addNotification(notification, type)
    }
  }, [])

  useEffect(() => {
    addNotification(notification, type)
  }, [notification])

  return notifications.map((notification, i) =>
    createPortal(
      <div
        key={`notification-${i}`}
        className={classnames(styles.toast, styles[`toast--${type}`])}
      >
        {notification.text}
      </div>,
      document.body
    )
  )
}

Toast.propTypes = {
  notification: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error', 'notice']),
}

Toast.defaultProps = {
  type: 'notice',
}

export default Toast
