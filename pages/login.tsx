import Logo from '@/components/svg/logo/logo'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { setCookie } from 'nookies'
import React, { useEffect } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'

const URL = process.env.NEXT_PUBLIC_API_URL as string

function Login({ user, isLoading }: any): JSX.Element {
	console.log(user)
	console.log(isLoading)
	const router = useRouter()
	const { query } = router
	useEffect(() => {
		if (query.token) {
			setCookie(null, 'ratethelandlord', query.token as string, {
				maxAge: 60 * 60 * 24 * 7, //expires in 7 days
			})
			const name = query.name as string
			localStorage.setItem('rtlUserId', `${name}`)

			router.push(`/admin/${name.split(' ').join('')}`)
		}
	}, [query])
	return (
		<div>
			<NextSeo noindex={true} />
			<Head>
				<title>Rate The Landlord</title>
			</Head>
			<div>
				<div className='px-6 py-24 sm:px-6 sm:py-32 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<div className='flex flex-row flex-wrap justify-center'>
							<Logo styling='w-24 h-24' />
							<h2 className='mt-6 w-full text-center text-3xl font-extrabold text-gray-900'>
								Sign in to your account
							</h2>
						</div>
						<p className='mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600'>
							This is the Admin Login for Rate The Landlord. If you are not an
							admin, please navigate back to the homepage.
						</p>
						<div className='mt-10 flex items-center justify-center gap-x-6'>
							<a
								href={`${URL}/auth/google`}
								className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
							>
								Login
							</a>
							<Link
								href='/'
								className='text-sm font-semibold leading-6 text-gray-900'
							>
								Home <span aria-hidden='true'>→</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withPageAuthRequired(Login)
