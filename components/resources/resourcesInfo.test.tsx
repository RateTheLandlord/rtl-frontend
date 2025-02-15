/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import ResourcesInfo from './resourcesInfo'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('react-i18next', () => ({
	useTranslation: jest.fn().mockReturnValue({
		t: jest.fn().mockImplementation((key) => {
			if (key === 'resources.title') {
				return 'Resources'
			} else if (key === 'resources.info') {
				return ['Info 1', 'Info 2', 'Info 3']
			}
		}),
	}),
}))

describe('ResourcesInfo', () => {
	it('renders ResourcesInfo component correctly', () => {
		render(<ResourcesInfo />)

		// Verify that the title is rendered
		const title = screen.getByText('Resources')
		expect(title).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<ResourcesInfo />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
