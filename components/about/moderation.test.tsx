/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import Moderation from './moderation'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('react-i18next', () => ({
	useTranslation: jest.fn().mockReturnValue({
		t: jest.fn().mockImplementation((key) => {
			if (key === 'about.moderation.moderation') {
				return 'Moderation Policy'
			} else if (key === 'about.moderation.info') {
				return ['Info paragraph 1', 'Info paragraph 2']
			}
		}),
	}),
}))

test('renders moderation section with title and info paragraphs', () => {
	render(<Moderation />)
	const moderationSection = screen.getByTestId('about-moderation-1')
	expect(moderationSection).toBeInTheDocument()

	expect(screen.getByText('Moderation Policy')).toBeInTheDocument()

	const infoParagraphs = moderationSection.querySelectorAll(
		"p[role='paragraph']",
	)
	expect(infoParagraphs).toHaveLength(2)
	expect(infoParagraphs[0]).toHaveTextContent('Info paragraph 1')
	expect(infoParagraphs[1]).toHaveTextContent('Info paragraph 2')
})

it('Should not have a11y violation', async () => {
	const { container } = render(<Moderation />)
	const result = await axe(container)
	expect(result).toHaveNoViolations()
})
