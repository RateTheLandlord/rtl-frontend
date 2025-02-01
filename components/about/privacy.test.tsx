/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import Privacy from './privacy'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Privacy', () => {
	it('renders privacy information correctly', () => {
		render(<Privacy />)

		const heading = screen.getByRole('heading', { name: /privacy/i })
		const paragraph = screen.getByText(/At Rate the Landlord/i)

		expect(heading).toBeInTheDocument()
		expect(paragraph).toBeInTheDocument()

		expect(heading).toHaveTextContent('Privacy') // Update with the expected translation
		expect(paragraph).toHaveTextContent('At Rate the Landlord') // Update with the expected translation
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<Privacy />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
