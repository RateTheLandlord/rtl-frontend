/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import { useTranslation } from 'react-i18next'
import Revenue from './revenue'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('react-i18next')

describe('Revenue', () => {
	let renderResult: RenderResult

	beforeEach(() => {
		const tMock = jest.fn((key: string) => key)
		;(useTranslation as jest.Mock).mockReturnValue({ t: tMock })

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
