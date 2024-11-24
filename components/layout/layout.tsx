import React from 'react'
import Footer from './footer'
import Navbar from './navbar'
import Banner from '../PostHog/CookieBanner'
import { changeLanguage } from 'i18next'

function Layout({ children }: { children: JSX.Element }): JSX.Element {
	changeLanguage('frca')
	return (
		<>
			<Navbar />
			<div className='flex min-h-screen justify-center' data-testid='layout-1'>
				{children}
			</div>
			<Banner />
			<Footer />
		</>
	)
}

export default Layout
