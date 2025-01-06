import TextInput from '@/components/ui/TextInput'
import LargeTextInput from '@/components/ui/LargeTextInput'

interface IProps {
	keyword: string
	setKeyword: (str: string) => void
	keywordReason: string
	setKeywordReason: (str: string) => void
}

const AddFlaggedKeywordModal = ({
	keyword,
	setKeyword,
	keywordReason,
	setKeywordReason,
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
							title='Keyword'
							value={keyword}
							setValue={setKeyword}
							id='keyword'
							placeHolder='Keyword'
						/>

						<LargeTextInput
							title='Reason'
							setValue={setKeywordReason}
							value={keywordReason}
							id='reason'
						/>
					</div>
				</div>
			</div>
		</form>
	)
}

export default AddFlaggedKeywordModal
