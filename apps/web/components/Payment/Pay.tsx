'use client'

import { redirect } from 'next/navigation'
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe } from '@stripe/react-stripe-js'
import StripeCheckout from './StripeCheckout'
import Card from '../Card'
import { Button } from '../Button'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string)

const Pay = ({
  paymentLink = null,
  amount,
  symbol,
  code,
  monthly = false,
  reason = null,
  title = 'Pay Me!',
}) => {
  let payLinks = process.env.NEXT_PUBLIC_PAY_LINKS
  if (payLinks && !monthly) {
    payLinks = JSON.parse(payLinks)
    if (payLinks && payLinks[symbol]) {
      const payLink: any = payLinks[symbol]

      if (payLink && payLink.max && payLink.max >= amount) {
        paymentLink = payLink.url.replace('{{amount}}', amount)
      }
    }
  }

  const elementsOptions: StripeElementsOptions = {
    amount: amount,
    currency: code,
    mode: 'payment',
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
            {/* <Elements stripe={stripePromise} options={elementsOptions}>
              <StripeCheckout
                amount={amount}
                currencyCode={code}
                currencySymbol={symbol}
                monthly={monthly}
                reason={reason}
              />
            </Elements> */}
            <p>Sorry, payments are currently offline :(</p>
          </>
        )}
      </Card>
    </>
  )
}

export default Pay
