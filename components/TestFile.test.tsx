/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { TestFile } from './TestFile'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('TestFile', () => {
	it('renders without crashing', () => {
		render(<TestFile />)

		const testSection = screen.getByTestId('testcomponent')
		expect(testSection).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<TestFile />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
