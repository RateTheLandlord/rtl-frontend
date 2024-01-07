import { combineObjects } from '@/util/helpers/helper-functions'
import { getRandomColour } from '@/util/helpers/randomColour'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

const BarGraph = ({ data }) => {
	const combinedData = combineObjects(data)
	return (
		<BarChart
			width={730}
			height={250}
			data={data}
			margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
		>
			<CartesianGrid strokeDasharray='3 3' />
			<Tooltip />
			<XAxis dataKey='date' />
			<YAxis />
			{Object.keys(combinedData).map((name, i) => {
				if (name !== 'date') {
					return (
						<Bar
							key={i}
							type='monotone'
							dataKey={name}
							fill={getRandomColour()}
						/>
					)
				}
				return <></>
			})}
		</BarChart>
	)
}

export default BarGraph
