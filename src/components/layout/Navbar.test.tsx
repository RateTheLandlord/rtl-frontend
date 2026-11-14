/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
import Navbar from './navbar'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('next/router', () => ({
	useRouter: () => ({
		pathname: '/',
	}),
}))

jest.mock('@/redux/hooks', () => ({
	useAppSelector: jest.fn(),
	useAppDispatch: jest.fn(),
}))

describe('Navbar', () => {
	test('renders Navbar component correctly', () => {
		// Mock the user object with jwt property

		render(<Navbar />)

		// Check if the Navbar title is rendered
		const titleElement = screen.getByText('layout.nav.title')
		expect(titleElement).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<UserProvider>
					<Navbar />
				</UserProvider>
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
