const GraphCard = ({ children, title }) => {
	return (
		<div className='flex flex-col gap-2 rounded-xl p-4 shadow-md'>
			<h5 className='text-xl font-bold'>{title}</h5>
			<div>{children}</div>
		</div>
	)
}

export default GraphCard
