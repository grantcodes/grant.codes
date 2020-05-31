import styled from 'styled-components'
import currencies from './currencies'
import { NextSeo } from 'next-seo'
import Card from '../Card'
import Button from '../Button'
import PageTitle from '../util/PageTitle'

const AmountInput = styled.div`
  padding: 0;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;

  & > * {
    flex-shrink: 1;
    &:first-child {
      margin-right: 0.5rem;
      max-width: 8rem;
    }
    &:last-child {
      flex-grow: 1;
    }
  }
`

let reason = ''
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search)
  reason = urlParams.get('reason')
}

const PaymentForm = ({ monthly = false }) => {
  return (
    <>
      <PageTitle>Give Me Money!</PageTitle>
      <Card>
        <NextSeo title="Pay Me" />
        <p>First I need to know how much you are paying me</p>

        <form method="post" action="/api/pay">
          <AmountInput>
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
          </AmountInput>

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
