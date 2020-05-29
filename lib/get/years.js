// TODO: generate dyamically from micropub endpoint
const getYears = async () => {
  const startYear = 2002
  const endYear = 2020
  const years = []
  for (let year = startYear; year < endYear; year++) {
    years.push(year)
  }
  return years
}

export default getYears
