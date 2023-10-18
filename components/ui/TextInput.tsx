interface IProps {
	title: string
	value: string | undefined
	setValue: (str: string) => void
	placeHolder?: string
	id: string
	error?: boolean
	errorText?: string
	testid?: string
}

const TextInput = ({
	title,
	value,
	setValue,
	placeHolder,
	id,
	error = false,
	errorText,
	testid,
}: IProps) => {
	return (
		<div data-testid={testid || ''} className='w-full sm:col-span-2'>
			<label
				htmlFor={id}
				className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
			>
				{title}
			</label>
			<div className='mt-1'>
				<div className='mt-1 sm:col-span-2 sm:mt-0'>
					<input
						onChange={(e) => setValue(e.target.value)}
						type='text'
						name={id}
						id={id}
						value={value}
						placeholder={placeHolder}
						className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
							error ? 'border-red-400' : ''
						}`}
					/>
				</div>
				{error && <p className='text-xs text-red-400'>{errorText}</p>}
			</div>
		</div>
	)
}

export default TextInput
