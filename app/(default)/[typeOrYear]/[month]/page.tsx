import { DataSummary } from 'components/DataSummary'
import getMonthData from 'lib/get/month-data'
import getMonthDataFiles from 'lib/get/month-data-files'

const leadingZero = num =>
  parseInt(num) < 10 && parseInt(num) > 0 ? `0${num}` : `${num}`

// TODO: Improve data fetching
const MonthlySummary = async ({ params }) => {
  if (
    !params.typeOrYear ||
    !params.month ||
    !parseInt(params.typeOrYear) ||
    !parseInt(params.month)
  ) {
    throw new Error('Year or month is not defined')
  }

  const data = getMonthData(params.typeOrYear, params.month)
  if (!data) {
    throw new Error('No data returned')
  }

  const { typeOrYear: year, month } = params

  const yearInt = parseInt(year)
  const monthInt = parseInt(month)
  const nextLink = `/${monthInt === 12 ? yearInt + 1 : year}/${
    monthInt === 12 ? '01' : leadingZero(monthInt + 1)
  }`
  const previousLink = `/${monthInt === 1 ? yearInt - 1 : year}/${
    month === 1 ? 12 : leadingZero(monthInt - 1)
  }`

  return (
    <DataSummary
      {...data}
      title={`Monthly Summary ${year}/${month}`}
      pagination={{
        previous: {
          // to: '/[typeOrYear]/[month]',
          to: previousLink,
        },
        next: {
          // to: '/[typeOrYear]/[month]',
          to: nextLink,
        },
      }}
    />
  )
}

// export const generateStaticParams = async () => {
//   const files = getMonthDataFiles()
//   const params = files.map((file) => {
//     const [year, month] = file.split('/')
//     return {
//       year,
//       month: leadingZero(month),
//       typeOrYear: year,
//     }
//   })

//   return params
// }

export default MonthlySummary
