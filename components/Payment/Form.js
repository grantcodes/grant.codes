import currencies from './currencies'
import Card from '../Card'
import { Button } from '../Button'
import styles from 'css/pages/payment.module.scss'

let reason = ''
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search)
  reason = urlParams.get('reason')
}

const PaymentForm = ({ monthly = false }) => {
  return (
    <>
      <h1 className="page-title">Give Me Money!</h1>
      <Card>
        <p>First I need to know how much you are paying me</p>

        <form method="post" action="/api/pay">
          <div className={styles['amount-input']}>
            <div>
              <label htmlFor="currency">Currency</label>
              <select name="currencySymbol" id="currency">
                {Object.keys(currencies).map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol} - {currencies[symbol]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                name="amount"
                id="amount"
                step="0.01"
                min="1"
                defaultValue="5"
              />
            </div>
          </div>

          <label htmlFor="reason">Reason</label>
          <input type="text" name="reason" id="reason" defaultValue={reason} />

          <label htmlFor="monthly" style={{ marginBottom: '1rem' }}>
            <input
              id="monthly"
              name="monthly"
              type="checkbox"
              style={{ marginRight: '.5em' }}
              defaultChecked={monthly}
            />
            Monthly recurring payment
          </label>
          <Button type="submit">Submit</Button>
        </form>
      </Card>
    </>
  )
}

export default PaymentForm
