import Pay from 'components/Payment/Pay'
import { getData } from 'components/Payment/get-amount-props'

export default async ({ params, searchParams }) => {
  const data = await getData({ params, searchParams, monthly: true })

  return <Pay {...data} monthly />
}

export const metadata = {
  title: 'Pay Me',
}
