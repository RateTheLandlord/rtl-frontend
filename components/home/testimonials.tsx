const testimonials = [
	{
		body: 'sounds like a great initiative, count me in!',
		author: {
			name: 'Reddit User',
		},
	},
	{
		body: "I love this idea. I've been saying for a long time that there should be a way for renters to vet landlords the same way landlords can do background checks on renters.",
		author: {
			name: 'Reddit User',
		},
	},
	{
		body: 'Been dreaming of this years! Keen for it to become GLOBAL. 🏆',
		author: {
			name: 'Reddit User',
		},
	},
	{
		body: `I consider your work heroic - thank you for providing a site that we can finally rate landlords!`,
		author: {
			name: 'Tenant Email',
		},
	},
	{
		body: `Good. As a landlord myself I\'d like to see bad landlords held accountable. They give those of us trying to provide a good service a bad name.`,
		author: {
			name: 'Twitter Landlord',
		},
	},
	{
		body: `This is a much needed service. I\'m really hoping you\'ll grow to be a global service`,
		author: {
			name: 'Instagram User',
		},
	},
]

export default function Testimonials() {
	return (
		<div>
			<div className='mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none'>
					<div className='-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3'>
						{testimonials.map((testimonial, idk) => (
							<div key={idk} className='pt-8 sm:inline-block sm:w-full sm:px-4'>
								<figure className='rounded-2xl bg-gray-50 p-8 text-sm leading-6'>
									<blockquote className='text-gray-900'>
										<p>{`“${testimonial.body}”`}</p>
									</blockquote>
									<figcaption className='mt-6 flex items-center gap-x-4'>
										<div>
											<div className='font-semibold text-gray-900'>
												{testimonial.author.name}
											</div>
										</div>
									</figcaption>
								</figure>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
