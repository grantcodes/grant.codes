'use client'

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { redirect } from 'next/navigation'
import { StripeProvider, Elements } from 'react-stripe-elements'
import StripeCheckout from './StripeCheckout'
import Card from '../Card'
import { Button } from '../Button'

const Pay = ({
  paymentLink,
  amount,
  symbol,
  code,
  monthly = false,
  reason = null,
  title = 'Pay Me!',
}) => {
  const [stripe, setStripe] = useState(null)

  const loadStripe = () => {
    const stripeScriptEl = document.getElementById('stripe-js')
    if (window.Stripe) {
      setStripe(window.Stripe(process.env.NEXT_PUBLIC_STRIPE_KEY))
    } else if (stripeScriptEl) {
      stripeScriptEl.addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        setStripe(window.Stripe(process.env.NEXT_PUBLIC_STRIPE_KEY))
      })
    } else {
      setTimeout(loadStripe, 1000)
    }
  }
  useEffect(loadStripe, [])

  let payLinks = process.env.NEXT_PUBLIC_PAY_LINKS
  if (payLinks && !monthly) {
    payLinks = JSON.parse(payLinks)
    const payLink = payLinks[symbol]
    if (payLink && payLink.max && payLink.max >= amount) {
      paymentLink = payLink.url.replace('{{amount}}', amount)
    }
  }

  return (
    <>
      <h1 className="page-title">{title}</h1>
      <Card>
        {paymentLink ? (
          <Button
            to={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              redirect('/pay/thanks')
            }}
          >
            Click to pay {symbol + amount}
          </Button>
        ) : (
          <>
            <Head>
              <script id="stripe-js" src="https://js.stripe.com/v3/" async />
            </Head>
            <StripeProvider stripe={stripe}>
              <Elements>
                <StripeCheckout
                  amount={amount}
                  currencyCode={code}
                  currencySymbol={symbol}
                  monthly={monthly}
                  reason={reason}
                />
              </Elements>
            </StripeProvider>
          </>
        )}
      </Card>
    </>
  )
}

export default Pay
