import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { redirect } from 'next/navigation'
import { Button } from '../Button'

import {
  injectStripe,
  CardElement,
  PaymentRequestButtonElement,
} from 'react-stripe-elements'

const StripeCheckout = ({
  stripe,
  amount,
  currencyCode,
  currencySymbol,
  monthly,
  reason,
}) => {
  const [paymentRequest, setPaymentRequest] = useState(null)
  const [canMakePayment, setCanMakePayment] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setupPaymentRequest()
  }, [])

  let description = `Payment of ${currencySymbol}${amount} to ${process.env.NEXT_PUBLIC_AUTHOR_NAME}`
  if (monthly) {
    description += ' (monthly)'
  }
  if (reason) {
    description += ` – Reason: ${reason}`
  }

  const setupPaymentRequest = async () => {
    // For full documentation of the available paymentRequest options, see:
    // https://stripe.com/docs/stripe.js#the-payment-request-object
    if (stripe) {
      const paymentReq = c({
        country: 'GB',
        currency: currencyCode.toLowerCase(),
        total: {
          label: description,
          amount: amount * 100,
        },
      })

      paymentReq.on('token', async ({ token, complete }) => {
        const result = await stripeTokenHandler(token.id)
        if (result) {
          complete('success')
          setSuccess(true)
        } else {
          complete('fail')
          setError('There was an error completing your payment')
        }
      })

      const canUsePaymentRequest = await paymentReq.canMakePayment()
      setCanMakePayment(!!canUsePaymentRequest && !monthly)
      setPaymentRequest(paymentReq)
    }
  }

  const stripeTokenHandler = async (token) => {
    const response = await fetch('/api/pay', {
      method: 'POST',
      body: JSON.stringify({
        token,
        monthly,
        description,
        currency: currencyCode.toLowerCase(),
        amount: amount * 100,
      }),
      headers: { 'content-type': 'application/json' },
    })

    return response.ok
  }

  const handleSubmit = async (e) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    e.preventDefault()

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    const result = await stripe.createToken({})
    if (result.error) {
      setError(result.error.message)
    } else {
      // Send the token to your server.
      const backendResult = await stripeTokenHandler(result.token.id)
      if (backendResult) {
        setSuccess(true)
      } else {
        setError('There was an error finalizing your payment')
      }
    }
  }

  if (success) {
    redirect('/pay/thanks')
  }

  return (
    <form onSubmit={handleSubmit}>
      <noscript>
        <p>
          Oh no! This won't work because you need JavaScript support. Sorry.
        </p>
      </noscript>
      <label htmlFor="card-element">Pay with your card</label>
      <CardElement
        id="card-element"
        className="input"
        style={{
          base: {
            color: 'var(--theme-contrast)',
            iconColor: 'var(--theme-contrast)',
            lineHeight: '22px',
            fontFamily: 'monospace',
            fontSmoothing: 'antialiased',
            fontSize: '18px',
            '::placeholder': {
              color: 'var(--theme-contrast)',
            },
          },
          invalid: {
            textDecoration: 'underline wavy',
            color: 'var(--theme-contrast)',
          },
        }}
      />

      {!!error && (
        <p>
          <small role="alert">{error}</small>
        </p>
      )}

      <Button type="submit">Pay!</Button>
      {!!canMakePayment && (
        <PaymentRequestButtonElement
          paymentRequest={paymentRequest}
          className="PaymentRequestButton"
          style={{
            // For more details on how to style the Payment Request Button, see:
            // https://stripe.com/docs/elements/payment-request-button#styling-the-element
            paymentRequestButton: {
              theme: 'dark',
              height: '64px',
            },
          }}
        />
      )}
    </form>
  )
}

StripeCheckout.propTypes = {
  amount: PropTypes.number.isRequired,
  currencyCode: PropTypes.string.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  monthly: PropTypes.bool.isRequired,
  reason: PropTypes.string,
}

export default injectStripe(StripeCheckout)
