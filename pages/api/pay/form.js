// Redirect to a pay url based off form data
export default (req, res) => {
  let redirect = '/pay'
  const { currencySymbol, amount, reason = '', monthly } = req.body

  if (currencySymbol && amount) {
    redirect = `/pay/${currencySymbol}${amount}`
  }

  if (monthly) {
    redirect += '/monthly'
  }

  if (reason) {
    redirect += `?reason=${encodeURIComponent(reason)}`
  }

  redirect = encodeURI(redirect)

  console.log('[Pay form redirect]', redirect)

  res.writeHead(302, { Location: redirect })
  return res.end()
}
