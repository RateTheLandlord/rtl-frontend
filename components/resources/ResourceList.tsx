const resources = [
	{
		id: 1,
		name: 'Toronto Tenants Union',
		country_code: 'CA',
		city: 'Toronto',
		state: 'On',
		address: '123 Main St',
		phone_number: '(123) 456-7890',
		description: 'A sample place description.',
		href: 'https://example.com/sample-place',
	},
]

export default function ResourceList() {
	return (
		<ul
			role='list'
			className='grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8'
		>
			{resources.map((resource) => (
				<li
					key={resource.id}
					className='overflow-hidden rounded-xl border border-gray-200 hover:border-teal-500'
				>
					<a href={resource.href}>
						<div className='flex flex-col items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6'>
							<div className='text-xl font-medium leading-6 text-gray-900'>
								{resource.name}
							</div>
							<div className='text-xs font-medium leading-6 text-gray-900'>
								{`${resource.city}, ${resource.state}, ${resource.country_code}`}
							</div>
						</div>
						<dl className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
							<div className='flex justify-between gap-x-4 py-3'>
								<dt className='text-gray-500'>Address</dt>
								<dd className='text-gray-700'>
									<div>{resource.address}</div>
								</dd>
							</div>
							<div className='flex justify-between gap-x-4 py-3'>
								<dt className='text-gray-500'>Phone Number</dt>
								<dd className='flex items-start gap-x-2'>
									<div className='font-medium text-gray-900'>
										{resource.phone_number}
									</div>
								</dd>
							</div>
							<div className='flex justify-between gap-x-4 py-3'>
								<dd className='flex items-start gap-x-2'>
									<div className='font-medium text-gray-900'>
										{resource.description}
									</div>
								</dd>
							</div>
						</dl>
					</a>
				</li>
			))}
		</ul>
	)
}
