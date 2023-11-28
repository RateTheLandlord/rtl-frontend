/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Modal from '@/components/modal/Modal'
import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import AddUserModal from '../components/AddUserModal'
import RemoveUserModal from '../components/RemoveUserModal'
import { fetcher } from '@/util/helpers/fetcher'
import Spinner from '@/components/ui/Spinner'
import { useAppDispatch } from '@/redux/hooks'
import { updateAlertOpen, updateAlertSuccess } from '@/redux/alert/alertSlice'

interface IUsers {
	id: number
	name: string
	email: string
	role: string
}

const TeamMembers = () => {
	const dispatch = useAppDispatch()
	const { mutate } = useSWRConfig()
	const [addUserOpen, setAddUserOpen] = useState(false)

	const [newUserName, setNewUserName] = useState('')
	const [newUserEmail, setNewUserEmail] = useState('')
	const [newUserPassword, setNewUserPassword] = useState('')
	const [newUserAdmin, setNewUserAdmin] = useState(false)

	const [removeUserOpen, setRemoveUserOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<IUsers>()

	const [users, setUsers] = useState<Array<IUsers>>([])

	const [loading, setLoading] = useState(false)

	const { data: allUsers, error } = useSWR<Array<IUsers>>(
		'/api/user/get-users',
		fetcher,
	)

	useEffect(() => {
		if (allUsers) {
			if (allUsers.length) {
				setUsers(allUsers)
			}
		}
	}, [allUsers])

	if (error) return <div>failed to load</div>
	if (!allUsers) return <Spinner />

	const onSubmitNewUser = (num: number) => {
		setLoading(true)
		const newUser = {
			name: newUserName,
			email: newUserEmail,
			password: newUserPassword,
			role: newUserAdmin ? 'ADMIN' : 'USER',
			blocked: false,
		}

		fetch('/api/user/add-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUser),
		})
			.then((result) => {
				if (!result.ok) {
					throw new Error()
				}
			})
			.then(() => {
				mutate('/api/user/get-users').catch((err) => console.log(err))
				setAddUserOpen(false)
				dispatch(updateAlertSuccess(true))
				dispatch(updateAlertOpen(true))
			})
			.catch((err) => {
				console.log(err)
				dispatch(updateAlertSuccess(false))
				dispatch(updateAlertOpen(true))
			})
			.finally(() => setLoading(false))
	}

	const onSubmitDeleteUser = (num: number) => {
		setLoading(true)
		fetch('/api/user/remove-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(selectedUser?.id),
		})
			.then((result) => {
				if (!result.ok) {
					throw new Error()
				}
			})
			.then(() => {
				mutate('/api/user/get-users').catch((err) => console.log(err))
				setRemoveUserOpen(false)
				dispatch(updateAlertSuccess(true))
				dispatch(updateAlertOpen(true))
			})
			.catch((err) => {
				console.log(err)
				setRemoveUserOpen(false)
				dispatch(updateAlertSuccess(false))
				dispatch(updateAlertOpen(true))
			})
			.finally(() => setLoading(false))
	}
	return (
		<div className='flex w-full flex-wrap justify-center px-4 sm:px-6 lg:px-8'>
			{selectedUser && (
				<Modal
					title='Remove User'
					open={removeUserOpen}
					setOpen={setRemoveUserOpen}
					element={<RemoveUserModal />}
					onSubmit={onSubmitDeleteUser}
					buttonColour='red'
					selectedId={selectedUser.id}
					loading={loading}
				/>
			)}
			<Modal
				title='Add User'
				open={addUserOpen}
				setOpen={setAddUserOpen}
				element={
					<AddUserModal
						setAdmin={setNewUserAdmin}
						isAdmin={newUserAdmin}
						setEmail={setNewUserEmail}
						setName={setNewUserName}
						setPassword={setNewUserPassword}
					/>
				}
				onSubmit={onSubmitNewUser}
				buttonColour='blue'
				selectedId={1}
				loading={loading}
			/>

			<div className='container mt-3 w-full sm:flex sm:items-center'>
				<div className='sm:flex-auto'>
					<h1 className='text-xl font-semibold text-gray-900'>Users</h1>
				</div>
				<div className='mt-4 sm:ml-16 sm:mt-0 sm:flex-none'>
					<button
						onClick={() => setAddUserOpen((p) => !p)}
						className='inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto'
					>
						Add user
					</button>
				</div>
			</div>
			<div className='container -mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg'>
				<table className='min-w-full divide-y divide-gray-300'>
					<thead className='bg-gray-50'>
						<tr>
							<th
								scope='col'
								className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
							>
								Name
							</th>
							<th
								scope='col'
								className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell'
							>
								Email
							</th>
							<th
								scope='col'
								className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell'
							>
								Permissions
							</th>

							<th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
								<span className='sr-only'>Remove</span>
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 bg-white'>
						{users.map((user) => (
							<tr key={user.id}>
								<td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6'>
									{user.name}
									<dl className='font-normal lg:hidden'>
										<dt className='sr-only'>Email</dt>
										<dd className='mt-1 truncate text-gray-500'>
											{user.email}
										</dd>
										<dt className='sr-only sm:hidden'>Role</dt>
										<dd className='mt-1 truncate text-gray-700 sm:hidden'>
											{user.role}
										</dd>
									</dl>
								</td>

								<td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
									{user.email}
								</td>
								<td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
									{user.role}
								</td>

								<td className='py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6'>
									{user.role === 'ADMIN' ? null : (
										<button
											onClick={() => {
												setSelectedUser(user)
												setRemoveUserOpen(true)
											}}
											className='text-indigo-600 hover:text-indigo-900'
										>
											Remove
										</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default TeamMembers
