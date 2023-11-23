import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const PieGraph = ({ data }) => {
	console.log(data)
	return (
		<PieChart width={730} height={250}>
			<Pie
				data={data}
				innerRadius={60}
				outerRadius={80}
				paddingAngle={5}
				dataKey='value'
				label
			>
				{data.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
				))}
			</Pie>
			<Tooltip />
			<Legend />
		</PieChart>
	)
}

export default PieGraph
