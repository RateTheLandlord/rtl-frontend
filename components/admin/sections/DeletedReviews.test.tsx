/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import DeletedReviews from './DeletedReviews'

describe('DeletedReviews', () => {

	test('renders the remove review modal', () => {
		render(
			<DeletedReviews />
		)

	})
})