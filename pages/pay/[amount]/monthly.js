import Pay from 'components/Payment/Pay'

export { getServerSideProps } from 'components/Payment/get-amount-props'

const MonthlyPaymentAmount = (props) => <Pay {...props} monthly />

export default MonthlyPaymentAmount
