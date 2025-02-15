import { XCircleIcon } from '@heroicons/react/solid'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'next-i18next'
import CloseButton from '../ui/CloseButton'

interface IProps {
	setMaliciousAlertOpen: Dispatch<SetStateAction<boolean>>
}

const MaliciousStringAlert = ({ setMaliciousAlertOpen }: IProps) => {
	const { t } = useTranslation('alerts')
	return (
		<div className='rounded-md bg-orange-200 p-4' data-testid='alert-1'>
			<div className='flex'>
				<div className='flex-shrink-0'>
					<XCircleIcon className='h-5 w-5 text-red-600' aria-hidden='true' />
				</div>
				<div className='ml-3'>
					<p className='text-sm text-orange-700'>
						{t('alerts.maliciousString')}
					</p>
				</div>
				<div className='ml-auto pl-3'>
					<CloseButton onClick={() => setMaliciousAlertOpen((p) => !p)} />
				</div>
			</div>
		</div>
	)
}

export default MaliciousStringAlert
