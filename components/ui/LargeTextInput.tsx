interface IProps {
	title: string
	id: string
	value?: string
	setValue: (str: string) => void
	rows?: number
	placeHolder?: string
	testid?: string
	length?: number
	limitText?: string
}

const LargeTextInput = ({
	title,
	id,
	value,
	setValue,
	rows = 4,
	placeHolder,
	testid = '',
	length,
	limitText,
}: IProps) => {
	return (
		<div className='w-full'>
			<label htmlFor={id} className='mt-2 block text-sm  text-gray-700'>
				{title}
			</label>
			<div className='mt-1'>
				<textarea
					rows={rows}
					name={id}
					id={id}
					onChange={(e) => setValue(e.target.value)}
					className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
					defaultValue={placeHolder}
					data-testid={testid}
				/>
				{limitText && value && length && (
					<div className='flex w-full justify-end'>
						<p
							data-testid='error-text'
							className={`text-xs ${
								value.length > length ? 'text-red-400' : 'text-black'
							}`}
						>
							{limitText}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default LargeTextInput
