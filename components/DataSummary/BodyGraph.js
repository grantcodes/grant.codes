import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts'

const BodyGraph = (props) => {
  let data = []
  const lines = Object.keys(props).map((key) => {
    let i = 0
    for (const { value, time } of props[key]) {
      const date = new Date(time).toLocaleDateString()
      if (!data[i]) {
        data[i] = { label: date }
      }
      data[i][key] = value
      i++
    }

    return key
  })

  return (
    <ResponsiveContainer width="100%" aspect={16 / 10}>
      <LineChart width={800} height={600} data={data}>
        <Tooltip />
        {lines.map((line) => (
          <Line
            key={line}
            type="monotone"
            dataKey={line}
            stroke="currentColor"
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default BodyGraph
