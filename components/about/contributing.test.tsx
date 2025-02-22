/**
 * @jest-environment jsdom
 */
import React from 'react'
import { RenderResult } from '@/test-utils'
import Contributing from './contributing'
import { axe, toHaveNoViolations } from 'jest-axe'
import { render } from '@/test-utils'
expect.extend(toHaveNoViolations)

describe('Contributing Test Suite', () => {
	let renderResult: RenderResult

	beforeEach(() => {
		renderResult = render(<Contributing />)
	})

	it('renders the component with translated content', () => {
		const { getByTestId, getByText } = renderResult

		// Check if the component renders correctly
		const contributingElement = getByTestId('about-contributing-1')
		expect(contributingElement).toBeInTheDocument()

		// Check if the contributing title is displayed correctly
		const titleElement = getByText('about.contributing.contributing')
		expect(titleElement).toBeInTheDocument()

		// Check if the contributing paragraph is displayed correctly
		const paragraphElement = getByText('about.contributing.info')
		expect(paragraphElement).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<Contributing />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
