import { getRandomColour } from '@/util/helpers/randomColour'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

const BarGraph = ({ data }) => {
	return (
		<BarChart
			width={730}
			height={250}
			data={data}
			margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
		>
			<CartesianGrid strokeDasharray='3 3' />
			<Tooltip />
			<Legend />
			<XAxis dataKey='date' />
			<YAxis />
			{Object.keys(data[0]).map((name, i) => {
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
