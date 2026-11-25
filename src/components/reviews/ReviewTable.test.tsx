/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test-utils'
import ReviewTable from './ReviewTable'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { Auth0Provider } from '@auth0/nextjs-auth0/client'
import { axe, toHaveNoViolations } from 'jest-axe'
import ModalProvider from '../modal/ModalProvider'
expect.extend(toHaveNoViolations)

describe('ReviewTable', () => {
	it('renders review table with no data', () => {
		render(
			<Provider store={store}>
				<Auth0Provider>
					<ModalProvider>
						<ReviewTable data={[]} isLoading={false} />
					</ModalProvider>
				</Auth0Provider>
			</Provider>,
		)

		// Check if no data message is rendered
		expect(screen.getByTestId('review-table-1-no-data')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<Auth0Provider>
					<ModalProvider>
						<ReviewTable data={[]} isLoading={false} />
					</ModalProvider>
				</Auth0Provider>
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
