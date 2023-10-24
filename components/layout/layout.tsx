import React from 'react'
import Footer from './footer'
import Navbar from './navbar'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Alert from '../alerts/Alert'
import { updateAlertOpen } from '@/redux/alert/alertSlice'

function Layout({ children }: { children: JSX.Element }): JSX.Element {
	const alert = useAppSelector((state) => state.alert)
	const dispatch = useAppDispatch()
	return (
		<>
			<Navbar />
			{alert.open && (
				<Alert
					success={alert.success}
					setAlertOpen={(bool: boolean) => dispatch(updateAlertOpen(bool))}
				/>
			)}
			<div className='flex min-h-screen justify-center' data-testid='layout-1'>
				{children}
			</div>
			<Footer />
		</>
	)
}

export default Layout
