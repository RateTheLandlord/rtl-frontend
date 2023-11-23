import { getRandomColour } from '@/util/helpers/randomColour'
import { Area, AreaChart, Tooltip, XAxis, YAxis } from 'recharts'
import { IDetailedStats } from '../types/types'

const AreaGraph = ({ data }) => {
	return (
		<AreaChart
			width={730}
			height={250}
			data={data}
			margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
		>
			<defs>
				<linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
					<stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
				</linearGradient>
				<linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
					<stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
				</linearGradient>
			</defs>
			<XAxis dataKey='date' />
			<YAxis />
			<Tooltip />
			<Area
				type='monotone'
				dataKey='total'
				stroke='#8884d8'
				fillOpacity={1}
				fill={getRandomColour()}
			/>
		</AreaChart>
	)
}

export default AreaGraph
