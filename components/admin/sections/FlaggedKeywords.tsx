import { Fragment, useState } from 'react'
import {
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	Transition,
} from '@headlessui/react'
import { classNames } from '@/util/helpers/helper-functions'
import { MenuAlt3Icon } from '@heroicons/react/solid'
import Button from '@/components/ui/button'
import useSWR from 'swr'
import { fetchWithBody } from '@/util/helpers/fetcher'
import Spinner from '@/components/ui/Spinner'
import { FlaggedKeywordsResponse, Keywords } from '@/util/interfaces/interfaces'
import Modal from '@/components/modal/Modal'
import { toast } from 'react-toastify'
import AddFlaggedKeywordModal from '../components/AddFlaggedKeywordModal'
import RemoveFlaggedKeywordModal from '../components/RemoveFlaggedKeywordModal'

const FlaggedKeywords = () => {
	const { data, error, mutate } = useSWR<FlaggedKeywordsResponse, unknown>(
		['/api/flagged-keywords/get-flagged-keywords', { limit: '1000' }],
		fetchWithBody,
	)

	const [loading, setLoading] = useState(false)
	const [keyword, setKeyword] = useState('')
	const [keywordReason, setKeywordReason] = useState('')

	const [selectedKeyword, setSelectedKeyword] = useState<Keywords | undefined>()

	const [addKeywordOpen, setAddKeywordOpen] = useState(false)
	const [removeKeywordOpen, setRemoveKeywordOpen] = useState(false)
	if (error) return <div>failed to load...</div>
	if (!data) return <Spinner />

	const resetForm = () => {
		setKeyword('')
		setKeywordReason('')
	}

	const onSubmitNewLandlord = () => {
		setLoading(true)
		const newKeyword = {
			keyword: keyword,
			reason: keywordReason,
		}

		fetch('/api/flagged-keywords/add-flagged-keyword', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newKeyword),
		})
			.then((result) => {
				if (!result.ok) {
					throw new Error()
				}
			})
			.then(() => {
				mutate().catch(() => console.error('Failed to Mutute Flagged Keywords'))
				setAddKeywordOpen(false)
				toast.success('Success!')
				resetForm()
			})
			.catch((err) => {
				console.log(err)
				toast.error('Failure: Something went wrong, please try again.')
			})
			.finally(() => setLoading(false))
	}

	const handleMutate = () => {
		mutate().catch(() => console.error('Failed to Mutute Flagged Keywords'))
	}
	return (
		<div className='container flex w-full flex-col justify-center'>
			{removeKeywordOpen && (
				<RemoveFlaggedKeywordModal
					selectedKeyword={selectedKeyword}
					handleMutate={handleMutate}
					setRemoveKeywordModalOpen={setRemoveKeywordOpen}
					removeKeywordModalOpen={removeKeywordOpen}
					setSelectedKeyword={setSelectedKeyword}
				/>
			)}
			{addKeywordOpen && (
				<Modal
					loading={loading}
					title='Add Flagged Keyword'
					open={addKeywordOpen}
					setOpen={setAddKeywordOpen}
					element={
						<AddFlaggedKeywordModal
							keyword={keyword}
							setKeyword={setKeyword}
							keywordReason={keywordReason}
							setKeywordReason={setKeywordReason}
						/>
					}
					onSubmit={onSubmitNewLandlord}
					selectedId={1}
				/>
			)}
			<div className='flex w-full justify-end'>
				<Button onClick={() => setAddKeywordOpen(true)}>Add New Keyword</Button>
			</div>
			{data.keywords.length && (
				<ul
					role='list'
					className='mt-2 divide-y divide-gray-100 border-t border-gray-100'
				>
					{data.keywords.map((keyword) => (
						<li
							key={keyword.id}
							className='flex items-center justify-between gap-x-6 py-3'
						>
							<div className='min-w-0'>
								<div className='flex items-center justify-start gap-x-3'>
									<p className='text-sm leading-6 text-gray-900'>
										{keyword.keyword}
									</p>
								</div>
								<div className='mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500'>
									<p className='truncate'>{keyword.reason}</p>
								</div>
							</div>
							<div className='flex flex-none items-center gap-x-4'>
								<Menu as='div' className='relative flex-none'>
									<MenuButton className='-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900'>
										<span className='sr-only'>Open options</span>
										<MenuAlt3Icon className='h-5 w-5' aria-hidden='true' />
									</MenuButton>
									<Transition
										as={Fragment}
										enter='transition ease-out duration-100'
										enterFrom='transform opacity-0 scale-95'
										enterTo='transform opacity-100 scale-100'
										leave='transition ease-in duration-75'
										leaveFrom='transform opacity-100 scale-100'
										leaveTo='transform opacity-0 scale-95'
									>
										<MenuItems className='absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
											<MenuItem>
												{({ active }) => (
													<button
														onClick={() => {
															setRemoveKeywordOpen(true)
															setSelectedKeyword(keyword)
														}}
														className={classNames(
															active ? 'bg-gray-50' : '',
															'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900',
														)}
													>
														Delete
														<span className='sr-only'>{keyword.keyword}</span>
													</button>
												)}
											</MenuItem>
										</MenuItems>
									</Transition>
								</Menu>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default FlaggedKeywords
