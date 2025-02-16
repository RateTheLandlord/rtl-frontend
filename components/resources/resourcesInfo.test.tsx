/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
import ResourcesInfo from './resourcesInfo'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('ResourcesInfo', () => {
	it('renders ResourcesInfo component correctly', () => {
		render(<ResourcesInfo />)

		// Verify that the title is rendered
		const title = screen.getByText('resources.title')
		expect(title).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<ResourcesInfo />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
