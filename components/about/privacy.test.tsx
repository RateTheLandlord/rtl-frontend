/**
 * @jest-environment jsdom
 */

import { render, screen } from '@/test-utils'
import Privacy from './privacy'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Privacy', () => {
	it('renders privacy information correctly', () => {
		render(<Privacy />)

		const heading = screen.getByRole('heading', { name: /privacy/i })

		expect(heading).toBeInTheDocument()

		expect(heading).toHaveTextContent('about.privacy.privacy')
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<Privacy />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
