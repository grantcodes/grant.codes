import { redirect } from 'next/navigation'
import currencies from './currencies'

export const getData = async ({ params, searchParams, monthly = false }) => {
  let symbol = null
  let code = null
  let amount = null
  let title = 'Pay Me!'
  const reason = searchParams?.reason

  const amountString = decodeURIComponent(
    params?.amount ?? searchParams?.amount ?? ''
  )
  for (const currencySymbol in currencies) {
    if (currencies.hasOwnProperty(currencySymbol)) {
      if (amountString.startsWith(currencySymbol)) {
        code = currencies[currencySymbol]
        symbol = currencySymbol
        amount = parseFloat(amountString.replace(symbol, '').replace(',', ''))
      }
    }
  }
  if (!code || !symbol) {
    symbol = Object.keys(currencies)[0]
    code = currencies[symbol]
    amount = parseFloat(amountString.replace(',', ''))
  }

  if (!symbol || !code || !amount) {
    console.log('[Unknown payment - redirecting]')
    return redirect('/pay')
  }

  title = `Pay me ${symbol}${amount}`
  if (monthly) {
    title += ' monthly'
  }

  console.log('[Payment]', { symbol, code, amount })

  return {
    symbol,
    code,
    amount,
    reason,
    title,
  }
}
