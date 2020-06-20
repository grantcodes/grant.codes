import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { palette } from '../Theme/helpers'

const notificationTimeout = 3000

const animation = keyframes`
0% {
  opacity: 0;
}
100% {
  opacity: 0.9;
}
`

const StyledToast = styled.div`
  display: inline-block;
  position: fixed;
  bottom: 10px;
  left: 50%;
  font-size: 0.8em;
  padding: 0.7em 1.4em;
  z-index: 100;
  background-color: ${({ type, theme }) =>
    type === 'error'
      ? 'red'
      : type === 'success'
      ? 'green'
      : theme.palette.complementary};
  color: var(--color-contrast);
  animation: ${animation} 0.2s both;
  opacity: 0.9;
  transform: translateX(-50%);
`

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

  return notifications.map((notification, i) => (
    <StyledToast key={`notification-${i}`} type={type}>
      {notification.text}
    </StyledToast>
  ))
}

Toast.propTypes = {
  notification: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error', 'notice']),
}

Toast.defaultProps = {
  type: 'notice',
}

export default Toast
