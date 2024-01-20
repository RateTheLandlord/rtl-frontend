/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import ReviewTable from './review-table'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { UserProvider } from '@auth0/nextjs-auth0/client'

describe('ReviewTable', () => {
	test('renders review table with no data', () => {
		render(
			<Provider store={store}>
				<UserProvider>
					<ReviewTable
						data={[]}
						setReportOpen={jest.fn()}
						setSelectedReview={jest.fn()}
						setRemoveReviewOpen={jest.fn()}
						setEditReviewOpen={jest.fn()}
					/>
				</UserProvider>
			</Provider>,
		)

		// Check if no data message is rendered
		expect(screen.getByTestId('review-table-1-no-data')).toBeInTheDocument()
	})
})
