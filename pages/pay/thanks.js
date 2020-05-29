import React from 'react'
import { NextSeo } from 'next-seo'
import Card from 'components/Card'
import PageTitle from 'components/util/PageTitle'

const PaymentThanks = () => (
  <>
    <NextSeo title="Thank You!" noIndex />
    <PageTitle>I'm Rich! 🎉💰</PageTitle>
    <Card>
      <p>Thank you very much for paying me. It is much appreciated</p>
    </Card>
  </>
)

export default PaymentThanks
