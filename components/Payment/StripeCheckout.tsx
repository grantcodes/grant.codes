import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { Button } from '../Button'
import {
  useStripe,
  useElements,
  PaymentElement,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js'
import { PaymentRequest } from '@stripe/stripe-js'

interface StripeCheckoutProps {
  amount: number
  currencyCode: string
  currencySymbol: string
  monthly: boolean
  reason?: string
}

const StripeCheckout = ({
  amount,
  currencyCode,
  currencySymbol,
  monthly = false,
  reason,
}: StripeCheckoutProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentRequest, setPaymentRequest] = useState<null | PaymentRequest>(
    null
  )
  const [canMakePayment, setCanMakePayment] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // For full documentation of the available paymentRequest options, see:
    // https://stripe.com/docs/stripe.js#the-payment-request-object
    if (stripe) {
      const paymentReq = stripe.paymentRequest({
        country: 'ES',
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

      paymentReq
        .canMakePayment()
        .then(() => {
          setCanMakePayment(!monthly)
          setPaymentRequest(paymentReq)
        })
        .catch((err) => {
          setCanMakePayment(false)
        })
    }
  }, [stripe, setCanMakePayment, setPaymentRequest])

  let description = `Payment of ${currencySymbol}${amount} to ${process.env.NEXT_PUBLIC_AUTHOR_NAME}`
  if (monthly) {
    description += ' (monthly)'
  }
  if (reason) {
    description += ` – Reason: ${reason}`
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

    if (!elements || !stripe) {
      return
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit()
    if (submitError) {
      // Show error to your customer
      setError(submitError?.message ?? null)
      return
    }

    // TODO: Here the request would get sent to the server and return the client secret.
    let clientSecret = ''

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret,
      confirmParams: {
        return_url: '.',
      },
    })

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setError(error?.message ?? null)
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
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
      <PaymentElement id="card-element" className="input" />

      {!!error && (
        <p>
          <small role="alert">{error}</small>
        </p>
      )}

      <Button type="submit">Pay!</Button>
      {!!canMakePayment && !!paymentRequest && (
        <PaymentRequestButtonElement
          options={{ paymentRequest }}
          className="PaymentRequestButton"
          // style={{
          //   // For more details on how to style the Payment Request Button, see:
          //   // https://stripe.com/docs/elements/payment-request-button#styling-the-element
          //   paymentRequestButton: {
          //     theme: 'dark',
          //     height: '64px',
          //   },
          // }}
        />
      )}
    </form>
  )
}

export default StripeCheckout
