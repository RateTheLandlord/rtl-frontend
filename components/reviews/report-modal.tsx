import React, { SetStateAction, useState } from 'react'
import {
	Description,
	Dialog,
	DialogPanel,
	DialogTitle,
} from '@headlessui/react'
import ButtonLight from '../ui/button-light'
import Button from '../ui/button'
import { Review } from '@/util/interfaces/interfaces'
import { useTranslations } from 'next-intl'
import { useReCaptcha } from 'next-recaptcha-v3'

interface IProps {
	isOpen: boolean
	setIsOpen: React.Dispatch<SetStateAction<boolean>>
	selectedReview: Review | undefined
}

interface IReportReason {
	id: number
	key: string
	reason: string
}

const reportReasons: IReportReason[] = [
	{
		id: 1,
		key: 'address',
		reason: 'address',
	},
	{
		id: 3,
		key: 'fake',
		reason: 'fake',
	},
	{
		id: 4,
		key: 'language',
		reason: 'language',
	},
	{
		id: 5,
		key: 'sensitive',
		reason: 'sensitive',
	},
	{
		id: 8,
		key: 'other',
		reason: 'other',
	},
]

function ReportModal({ isOpen, setIsOpen, selectedReview }: IProps) {
	const t = useTranslations('reviews')
	const tr = useTranslations('report')
	const [reason, setReason] = useState<string>(reportReasons[0].key)
	const [selectedReason, setSelectedReason] = useState<IReportReason>(
		reportReasons[0],
	)

	const [submitSuccess, setSubmitSuccess] = useState(false)
	const [submitError, setSubmitError] = useState(false)
	const { executeRecaptcha } = useReCaptcha()

	const handleSubmit = async () => {
		if (selectedReview) {
			const token = await executeRecaptcha('report_modal')
			if (token) {
				fetch(`/api/review/flag-review`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: selectedReview.id,
						captchaToken: token,
						flagged_reason: reason,
					}),
				})
					.then((result: Response) => {
						if (!result.ok) {
							throw new Error()
						} else {
							return result.json()
						}
					})
					.then(() => {
						setSubmitSuccess(true)
					})
					.catch(() => {
						setSubmitError(false)
					})
			} else {
				setSubmitError(true)
			}
		}
	}

	return (
		<Dialog
			className='relative z-50'
			open={isOpen}
			onClose={() => {
				setReason(reportReasons[0].key)
				setSubmitSuccess(false)
				setSubmitError(false)
				setIsOpen(false)
			}}
		>
			<div
				className='fixed inset-0 bg-black/30'
				aria-hidden='true'
				data-testid='report-modal-1'
			/>
			<div className='fixed inset-0 flex items-center justify-center p-4'>
				<DialogPanel className='w-full max-w-sm rounded-md bg-white p-10'>
					{submitError ? (
						<div className='flex w-full flex-col items-center gap-4'>
							<DialogTitle className='text-red-400'>
								{t('report.error')}
							</DialogTitle>
							<div className='flex w-full justify-end'>
								<ButtonLight
									onClick={() => {
										setReason(reportReasons[0].key)
										setSubmitSuccess(false)
										setSubmitError(false)
										setIsOpen(false)
									}}
								>
									{t('report.cancel')}
								</ButtonLight>
							</div>
						</div>
					) : null}
					{submitSuccess ? (
						<div className='flex w-full flex-col items-center gap-4'>
							<DialogTitle>{t('report.success')}</DialogTitle>
							<div className='flex w-full justify-end'>
								<ButtonLight
									onClick={() => {
										setReason(reportReasons[0].key)
										setSubmitSuccess(false)
										setSubmitError(false)
										setIsOpen(false)
									}}
								>
									{t('report.cancel')}
								</ButtonLight>
							</div>
						</div>
					) : null}
					{!submitError && !submitSuccess ? (
						<>
							<DialogTitle className='mb-2 text-center text-xl'>
								{t('report.report')}
							</DialogTitle>
							<Description className='text-sm'>
								{t('report.description')}
							</Description>

							<div className='mb-3'>
								<label
									htmlFor='reason'
									className='block text-sm leading-6 text-gray-900'
								>
									{t('report.select-reason')}
								</label>
								<select
									id='reason'
									name='reason'
									className='mt-2 block w-full rounded-md border-0 py-1.5 pr-10 pl-3 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
									defaultValue={reason}
									onChange={(e) => {
										const selected: IReportReason[] = reportReasons.filter(
											(reason: IReportReason) => reason.key === e.target.value,
										)
										setSelectedReason(selected[0])
										setReason(selected[0].key)
									}}
								>
									{reportReasons.map((reason) => {
										return (
											<option key={reason.id} value={reason.key}>
												{tr(reason.reason)}
											</option>
										)
									})}
								</select>
							</div>

							{selectedReason.key === 'other' ? (
								<div className='mb-3'>
									<label
										htmlFor='report'
										className='block text-sm text-gray-700'
									>
										{t('report.reason')}
									</label>
									<div className='mt-1'>
										<textarea
											rows={4}
											name='report'
											id='report'
											onChange={(e) =>
												setReason(`${selectedReason.key}: ${e.target.value}`)
											}
											className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											placeholder='Write your reasoning here...'
										/>
										<p
											className={`text-xs ${
												reason.length >= 255 ? 'text-red-400' : 'text-black'
											}`}
										>
											{t('report.limit', { total: reason.length - 5 })}
										</p>
									</div>
								</div>
							) : null}

							<div className='flex flex-row justify-center gap-5 sm:gap-3'>
								<ButtonLight
									onClick={() => {
										setSelectedReason(reportReasons[0])
										setReason(reportReasons[0].key)
										setIsOpen(false)
									}}
								>
									{t('report.cancel')}
								</ButtonLight>
								<Button
									onClick={() => {
										handleSubmit().catch(() =>
											console.error('Failed To Submit Report'),
										)
									}}
									disabled={reason.length >= 255}
								>
									{t('report.submit')}
								</Button>
							</div>
						</>
					) : null}
				</DialogPanel>
			</div>
		</Dialog>
	)
}

export default ReportModal
