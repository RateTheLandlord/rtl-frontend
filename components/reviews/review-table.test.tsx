/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import ReviewTable from './review-table'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

describe('ReviewTable', () => {
	const mockData = [
		{
			landlord: 'John Doe',
			country_code: 'US',
			city: 'New York',
			state: 'NY',
			zip: '12345',
			review: 'Lorem ipsum dolor sit amet.',
			health: '5',
			repair: '2',
			respect: '4',
			privacy: '3',
			id: 123,
			stability: '1',
			date_added: new Date().toLocaleDateString(),
			flagged: false,
			flagged_reason: '',
			admin_approved: null,
			admin_edited: false,
		},
	]

	test('renders review table with no data', () => {
		render(
			<Provider store={store}>
				<ReviewTable
					data={[]}
					setReportOpen={jest.fn()}
					setSelectedReview={jest.fn()}
					setRemoveReviewOpen={jest.fn()}
					setEditReviewOpen={jest.fn()}
				/>
			</Provider>,
		)

		// Check if no data message is rendered
		expect(screen.getByTestId('review-table-1-no-data')).toBeInTheDocument()
	})
})
