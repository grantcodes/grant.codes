import React, { Component, Fragment } from 'react'
import ErrorMessage from './ErrorMessage'
import Button from './Button'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: props.hasError, message: null }
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({
      hasError: true,
      message: error && error.message ? error.message : null,
    })
    // You can also log the error to an error reporting service
    console.log(error, info)
    // logErrorToMyService(error, info);
  }

  render() {
    const { hasError, message } = this.state
    if (hasError) {
      return (
        <Fragment>
          <ErrorMessage message={message} />
          <Button onClick={() => this.setState({ hasError: false })}>
            Continue Anyway
          </Button>
        </Fragment>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
