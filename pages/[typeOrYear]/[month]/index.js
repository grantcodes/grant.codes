import DataSummary from 'components/DataSummary'
import getMonthData from 'lib/get/month-data'
import getMonthDataFiles from 'lib/get/month-data-files'

const leadingZero = (num) =>
  parseInt(num) < 10 && parseInt(num) > 0 ? `0${num}` : `${num}`

const MonthlySummary = ({ year, month, ...props }) => {
  const yearInt = parseInt(year)
  const monthInt = parseInt(month)
  const nextLink = `/${monthInt === 12 ? yearInt + 1 : year}/${
    monthInt === 12 ? '01' : leadingZero(monthInt) + 1
  }`
  const previousLink = `/${monthInt === 1 ? yearInt - 1 : year}/${
    month === 1 ? 12 : leadingZero(monthInt - 1)
  }`

  return (
    <DataSummary
      {...props}
      title={`Monthly Summary ${year}/${month}`}
      pagination={{
        previous: {
          to: '/[typeOrYear]/[month]',
          linkAs: previousLink,
        },
        next: {
          to: '/[typeOrYear]/[month]',
          linkAs: nextLink,
        },
      }}
    />
  )
}

export const getStaticProps = ({ params }) => {
  try {
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
    return {
      props: {
        year: params.typeOrYear,
        month: params.month,
        ...data,
      },
    }
  } catch (err) {
    console.error('[Error getting monthly data file]', err)
    return {
      props: {},
    }
  }
}

export const getStaticPaths = () => {
  const files = getMonthDataFiles()
  const paths = files.map((file) => {
    const [year, month] = file.split('/')
    return {
      params: {
        year,
        month: leadingZero(month),
        typeOrYear: year,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export default MonthlySummary
