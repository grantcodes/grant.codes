import currencies from './currencies'

export const getServerSideProps = ({ query, res }) => {
  let symbol = null
  let code = null
  let amount = null
  const reason = query.reason || null

  const amountString = query.amount
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

  if ((!symbol || !code || !amount) && res) {
    console.log('[Unknown payment - redirecting]')
    res.writeHead(302, { Location: '/pay' })
    return res.end()
  }

  console.log('[Payment]', { symbol, code, amount })

  return {
    props: {
      symbol,
      code,
      amount,
      reason,
    },
  }
}
