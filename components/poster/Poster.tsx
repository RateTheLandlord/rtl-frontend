import Image from 'next/image'

const Poster = () => {
	return (
		<div className='flex flex-col items-center justify-center p-4'>
			<a
				href='/poster/rtl_poster.pdf'
				download='/poster/rtl_poster.pdf'
				className='group relative cursor-pointer'
			>
				<Image
					src='/poster_picture.webp'
					alt='Poster'
					width='270'
					height='384'
					className='h-96 w-[260px] rounded-lg object-cover shadow-lg transition-opacity group-hover:opacity-80'
				/>
				<div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
					<span className='rounded-lg bg-white px-4 py-2 font-semibold text-black'>
						Download PDF
					</span>
				</div>
			</a>
			<p className='mt-2 text-sm text-gray-600'>
				Download and Share our poster!
			</p>
		</div>
	)
}

export default Poster
