import Stripe from 'stripe'

export default async (req, res) => {
  if (req.method === 'POST') {
    const { token, currency, amount, monthly, description } = req.body
    if (!token || !currency || !amount) {
      res.status(400).json({ error: 'Missing token, currency or amount' })
    }
    const stripe = Stripe(process.env.STRIPE_PRIVATE)

    try {
      if (monthly) {
        const product = await stripe.products.create({
          name: description,
          type: 'service',
        })
        const plan = await stripe.plans.create({
          amount,
          currency,
          product: product.id,
          nickname: 'Monthly Payments',
          interval: 'month',
        })
        const customer = await stripe.customers.create({
          source: token,
        })
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ plan: plan.id }],
        })
        console.log('[Successful recurring payment]')
        return res.json({ subscription: subscription.id })
      } else {
        const charge = await stripe.charges.create({
          amount: parseInt(amount),
          currency: currency,
          description: description,
          source: token,
        })
        console.log('[Successful payment]')
        return res.json({ charge: charge.id })
      }
    } catch (err) {
      console.error('[Error charging user with stripe]', err)
      res.status(400).json({ error: err.message })
    }
    return res.end()
  }
  return res.status(405)
}
