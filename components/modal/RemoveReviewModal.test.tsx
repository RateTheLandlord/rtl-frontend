/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import RemoveReviewModal from './RemoveReviewModal'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

describe('RemoveReviewModal', () => {
	const mockSelectedReview = {
		landlord: 'John Doe',
		country_code: 'US',
		city: 'New York',
		state: 'NY',
		zip: '12345',
		review: 'Great experience',
		health: 4,
		repair: 4,
		respect: 3,
		privacy: 2,
		id: 123,
		stability: 1,
		date_added: new Date(),
		flagged: false,
		flagged_reason: '',
		admin_approved: null,
		admin_edited: false,
		moderation_reason: null,
	}

	test('renders the remove review modal', () => {
		render(
			<Provider store={store}>
				<RemoveReviewModal
					selectedReview={mockSelectedReview}
					handleMutate={jest.fn()}
					setRemoveReviewOpen={jest.fn()}
					removeReviewOpen={true}
					setSelectedReview={jest.fn()}
				/>
			</Provider>,
		)

		// Verify that the modal title is rendered
		const modalTitle = screen.getByText('Remove Review')
		expect(modalTitle).toBeInTheDocument()

		// Verify that the confirmation message is rendered
		const confirmationMessage = screen.getByText(
			'Are you sure you want to remove this review? This cannot be undone.',
		)
		expect(confirmationMessage).toBeInTheDocument()
	})
})
