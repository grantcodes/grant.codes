import { NextApiRequest, NextApiResponse } from 'next'
// import Stripe from '@stripe/stripe-js'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(501).json({ error: 'Payments are currently disabled' })
  // if (req.method === 'POST') {
  //   const { token, currency, amount, monthly, description } = req.body
  //   if (!token || !currency || !amount) {
  //     return res
  //       .status(400)
  //       .json({ error: 'Missing token, currency or amount' })
  //   }
  //   const stripe = new Stripe(process.env.STRIPE_PRIVATE as string, {
  //     apiVersion: '2022-11-15',
  //   })

  //   try {
  //     if (monthly) {
  //       const product = await stripe.products.create({
  //         name: description,
  //         type: 'service',
  //       })
  //       const plan = await stripe.plans.create({
  //         amount,
  //         currency,
  //         product: product.id,
  //         nickname: 'Monthly Payments',
  //         interval: 'month',
  //       })
  //       const customer = await stripe.customers.create({
  //         source: token,
  //       })
  //       const subscription = await stripe.subscriptions.create({
  //         customer: customer.id,
  //         items: [{ plan: plan.id }],
  //       })
  //       console.log('[Successful recurring payment]')
  //       return res.json({ subscription: subscription.id })
  //     } else {
  //       const chargeData = {
  //         amount: parseInt(amount),
  //         currency: currency,
  //         description: description,
  //         source: token,
  //       }
  //       console.log('[Creating stripe charge]', chargeData)
  //       const charge = await stripe.charges.create(chargeData)
  //       console.log('[Successful payment]')
  //       return res.json({ charge: charge.id })
  //     }
  //   } catch (err) {
  //     console.error('[Error charging user with stripe]', err)
  //     res.status(400).json({ error: err.message })
  //   }
  //   return res.end()
  // } else {
  //   let redirect = '/pay'
  //   const { currencySymbol, amount, reason = '', monthly } = req.body

  //   if (currencySymbol && amount) {
  //     redirect = `/pay/${currencySymbol}${amount}`
  //   }

  //   if (monthly) {
  //     redirect += '/monthly'
  //   }

  //   if (reason) {
  //     redirect += `?reason=${encodeURIComponent(reason)}`
  //   }

  //   redirect = encodeURI(redirect)

  //   console.log('[Pay form redirect]', redirect)

  //   return res.redirect(302, redirect)
  // }
}
