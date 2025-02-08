/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import DeletedReviews from './DeletedReviews'

describe('DeletedReviews', () => {

	test('renders the remove review modal', () => {
		render(
			<DeletedReviews />
		)

		const deleteReason = screen.getByText('Delete Reason')
		expect(deleteReason).toBeInTheDocument()
		const reviewTitle = screen.getByText('Review')
		expect(reviewTitle).toBeInTheDocument()
	})
})