/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test-utils'
import UserRemoveReviewModal from './UserRemoveReviewModal'
import { store } from '@/redux/store'
import { Provider } from 'react-redux'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('UserRemoveReviewModal', () => {
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
		restored_by: null,
	}

	test('renders RemoveReviewModal with selected review data', () => {
		render(
			<UserProvider>
				<Provider store={store}>
					<UserRemoveReviewModal
						selectedReview={mockSelectedReview}
						handleMutate={jest.fn()}
						setSelectedReview={jest.fn()}
						userRemoveReviewOpen={true}
						setUserRemoveReviewOpen={jest.fn()}
						userKey={''}
						setUserKey={jest.fn()}
						setUserEditMode={jest.fn()}
					/>
				</Provider>
			</UserProvider>,
		)

		// Verify that the modal title is rendered
		const modalTitle = screen.getByText('user-delete.remove')
		expect(modalTitle).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<UserProvider>
				<Provider store={store}>
					<UserRemoveReviewModal
						selectedReview={mockSelectedReview}
						handleMutate={jest.fn()}
						setSelectedReview={jest.fn()}
						userRemoveReviewOpen={true}
						setUserRemoveReviewOpen={jest.fn()}
						userKey={''}
						setUserKey={jest.fn()}
						setUserEditMode={jest.fn()}
					/>
				</Provider>
			</UserProvider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
