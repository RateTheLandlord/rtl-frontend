import React, { type JSX } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'
import Banner from '../postHog/CookieBanner'

function Layout({ children }: { children: JSX.Element }): JSX.Element {
	return (
		<>
			<Navbar />
			<div
				className='font-inclusive flex min-h-screen justify-center'
				data-testid='layout-1'
			>
				{children}
			</div>
			<Banner />
			<Footer />
		</>
	)
}

export default Layout
