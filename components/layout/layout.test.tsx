/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render } from '@/test-utils'
import Layout from './layout'
import { axe, toHaveNoViolations } from 'jest-axe'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
expect.extend(toHaveNoViolations)

import { useRouter } from 'next/router'

jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

describe('Layout component', () => {
	beforeEach(() => {
		;(useRouter as jest.Mock).mockReturnValue({
			route: '/test-route',
			pathname: '/test-pathname',
			query: { id: '123' },
			asPath: '/test-route',
		})
	})
	it('should render the Navbar, children, Banner, and Footer', () => {
		const { getByTestId } = render(
			<Provider store={store}>
				<UserProvider>
					<Layout>
						<div data-testid='child'>Child Component</div>
					</Layout>
				</UserProvider>
			</Provider>,
		)

		expect(getByTestId('layout-1')).toBeInTheDocument()
		expect(getByTestId('layout-1').textContent).toContain('Child Component')
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<UserProvider>
				<Layout>
					<div data-testid='child'>Child Component</div>
				</Layout>
			</UserProvider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
