import Pay from 'components/Payment/Pay'
import { getData } from 'components/Payment/get-amount-props'

export default async ({ params, searchParams }) => {
  const data = await getData({ params, searchParams })

  return <Pay {...data} />
}

export const metadata = {
  title: 'Pay Me',
}
