const StateStats = ({
	states,
}: {
	states?: Array<{
		key: string
		total: string
	}>
}) => {
	const sortedStates = states?.sort((a, b) => Number(b.total) - Number(a.total))
	return (
		<div className='flex w-full flex-row flex-wrap gap-2'>
			{sortedStates?.map((state) => {
				return (
					<div
						key={state.key + state.total}
						className='flex flex-col p-6 text-center'
					>
						<dt className='order-2 mt-2 text-lg  leading-6 text-gray-500'>
							{state.key}
						</dt>
						<dd className='order-1 text-5xl   text-indigo-600'>
							{state.total}
						</dd>
					</div>
				)
			})}
		</div>
	)
}

export default StateStats
