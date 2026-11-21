'use client'

import Logo from '@/components/svg/logo/Logo'
import { Link, useRouter } from '@/i18n/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useEffect, type JSX } from 'react'

export default function LoginScreen(): JSX.Element {
	const router = useRouter()
	const { user } = useUser()

	useEffect(() => {
		if (user?.role === 'ADMIN') {
			router.replace(`/admin/${encodeURIComponent(user.name ?? '')}`)
		}
	}, [router, user])

	return (
		<div>
			<div className='px-6 py-24 sm:px-6 sm:py-32 lg:px-8'>
				<div className='mx-auto max-w-2xl text-center'>
					<div className='flex flex-row flex-wrap justify-center'>
						<Logo styling='w-24 h-24' />
						<h2 className='mt-6 w-full text-center text-3xl text-gray-900'>
							Sign in to your account
						</h2>
					</div>
					<p className='mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600'>
						This is the Admin Login for Rate The Landlord. If you are not an
						admin, please navigate back to the homepage.
					</p>
					<div className='mt-10 flex items-center justify-center gap-x-6'>
						<a
							href='/api/auth/login'
							className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
						>
							Login
						</a>
						<Link href='/' className='text-sm leading-6 text-gray-900'>
							Home <span aria-hidden='true'>→</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
