import { useTranslations } from 'next-intl'
import { useState } from 'react'
import Button from '../ui/button'
import { useModal } from './ModalContext'
import ModalShell from './ModalShell'

const CopyUserCodeModal = ({
	onClose,
	code,
}: {
	onClose: () => void
	code: string
}) => {
	const { openModal } = useModal()
	const t = useTranslations('user-code')
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000) // reset after 2s
		} catch (err) {
			console.error('Failed to copy:', err)
		}
	}

	return (
		<ModalShell
			title={t('title')}
			onClose={() => {
				onClose()
				openModal('success', {})
			}}
		>
			<>
				<div className='sm:flex sm:items-start'>
					<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
						<div className='my-2 flex flex-col gap-3'>
							<p>{t('message')}</p>

							<p>{t('success')}</p>
						</div>
					</div>
				</div>
				<div className='flex justify-center'>
					<div className='rounded-l-md border border-black p-2'>{code}</div>
					<button
						onClick={() => void handleCopy()}
						className='bg-primary focus-visible:outline-primary hover:bg-primary-hover w-1/2 flex-none cursor-pointer rounded-r-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2'
					>
						{copied ? `${t('copied')}` : `${t('copy')}`}
					</button>
				</div>
				<div className='mt-5 gap-2 sm:mt-4 sm:flex sm:flex-row-reverse'>
					<Button
						onClick={() => {
							onClose()
							openModal('success', {})
						}}
					>
						{t('button')}
					</Button>
				</div>
			</>
		</ModalShell>
	)
}

export default CopyUserCodeModal
