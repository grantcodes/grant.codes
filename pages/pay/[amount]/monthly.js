import Pay from 'components/Payment/Pay'

export { getServerSideProps } from 'components/Payment/get-amount-props'

export default (props) => <Pay {...props} monthly />
