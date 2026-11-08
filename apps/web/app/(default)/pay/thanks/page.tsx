import React from 'react'
import Card from 'components/Card'

const PaymentThanks = () => (
  <>
    <h1 className='page-title'>I'm Rich! 🎉💰</h1>
    <Card>
      <p>Thank you very much for paying me. It is much appreciated</p>
    </Card>
  </>
)

export default PaymentThanks

export const metadata = {
  title: 'Thank You!',
  robots: {
    index: false,
  },
}
