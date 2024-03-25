import { useEffect, useState } from 'react'

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
	{
		body: `So I’m a landlord and love this page. If you\'re a landlord and have a problem with this site, you are literally the problem. It\'s incredibly fucking easy to be a good landlord.`,
		author: {
			name: 'Instagram Landlord',
		},
	},
]

export default function Testimonials() {
	const [currTestimonial, setCurrTestimonial] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			const num = Math.floor(Math.random() * testimonials.length)
			setCurrTestimonial(num)
		}, 5000)

		return () => clearInterval(timer)
	}, [currTestimonial])
	return (
		<div
			data-testid='home-testimonial'
			className='mx-auto max-w-7xl px-6 lg:px-8'
		>
			<div className='mx-auto my-8 flow-root max-w-2xl lg:mx-0 lg:max-w-none'>
				<div className='-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3'>
					{testimonials.map((testimonial, idx) => (
						<div key={idx} className='pt-8 sm:inline-block sm:w-full sm:px-4'>
							<figure
								className={`rounded-2xl p-8 text-sm leading-6 transition-all duration-500 ease-in-out ${
									idx === currTestimonial
										? 'scale-110 bg-teal-600 text-white'
										: 'scale-100 bg-gray-50 text-gray-900'
								}`}
							>
								<blockquote>
									<p>{`“${testimonial.body}”`}</p>
								</blockquote>
								<figcaption className='mt-6 flex items-center gap-x-4'>
									<div>
										<h3>{testimonial.author.name}</h3>
									</div>
								</figcaption>
							</figure>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
