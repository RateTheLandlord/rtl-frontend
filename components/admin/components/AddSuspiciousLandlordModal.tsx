import TextInput from '@/components/ui/TextInput'
import LargeTextInput from '@/components/ui/LargeTextInput'

interface IProps {
	landlord: string
	setLandlord: (str: string) => void
	message: string
	setMessage: (str: string) => void
}

const AddSuspiciousLandlordModal = ({
	landlord,
	setLandlord,
	message,
	setMessage,
}: IProps) => {
	return (
		<form
			className='container w-full space-y-8 divide-y divide-gray-200'
			data-testid='add-user-modal-1'
		>
			<div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
				<div className='space-y-6 pt-8 sm:space-y-5 sm:pt-10'>
					<div className='space-y-6 sm:space-y-5'>
						<TextInput
							title='Landlord'
							value={landlord}
							setValue={setLandlord}
							id='landlord'
							placeHolder='Landlord'
						/>

						<LargeTextInput
							title='Message'
							setValue={setMessage}
							value={message}
							id='message'
						/>
					</div>
				</div>
			</div>
		</form>
	)
}

export default AddSuspiciousLandlordModal
