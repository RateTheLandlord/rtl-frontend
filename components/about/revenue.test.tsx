/**
 * @jest-environment jsdom
 */
import React from 'react'
import Revenue from './revenue'
import { axe, toHaveNoViolations } from 'jest-axe'
import { render, RenderResult } from '@/test-utils'
expect.extend(toHaveNoViolations)

describe('Revenue', () => {
	let renderResult: RenderResult

	beforeEach(() => {
		renderResult = render(<Revenue />)
	})

	test('renders the component with translated content', () => {
		const { getByTestId, getByText } = renderResult

		// Check if the component renders correctly
		const contributingElement = getByTestId('about-revenue-1')
		expect(contributingElement).toBeInTheDocument()

		// Check if the contributing title is displayed correctly
		const titleElement = getByText('about.revenue.title')
		expect(titleElement).toBeInTheDocument()

		// Check if the contributing paragraph is displayed correctly
		const paragraphElement = getByText('about.revenue.info')
		expect(paragraphElement).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<Revenue />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
