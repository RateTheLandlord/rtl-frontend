/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import RestoreReviewModal from './RestoreReviewModal'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { UserProvider } from '@auth0/nextjs-auth0/client'

describe('RestoreReviewModal', () => {
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
		moderator: null,
		delete_date: null,
		delete_reason: null,
		deleted_by: null,
		restore_date: null,
		restore_reason: null,
		restored_by: null
	}

	test('renders the remove review modal', () => {
		render(
			<UserProvider>
				<Provider store={store}>
					<RestoreReviewModal
						selectedReview={mockSelectedReview}
						handleMutate={jest.fn()}
						setRestoreReviewOpen={jest.fn()}
						restoreReviewOpen={true}
						setSelectedReview={jest.fn()}
					/>
				</Provider>
			</UserProvider>,
		)

		// Verify that the modal title is rendered
		const modalTitle = screen.getByText('Restore Review')
		expect(modalTitle).toBeInTheDocument()
	})
})
