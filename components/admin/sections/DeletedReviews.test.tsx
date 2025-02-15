/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import DeletedReviews from './DeletedReviews'
import { axe } from 'jest-axe'

describe('DeletedReviews', () => {
	test('renders the remove review modal', () => {
		render(<DeletedReviews />)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<DeletedReviews />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
