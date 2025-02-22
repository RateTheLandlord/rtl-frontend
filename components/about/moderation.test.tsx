/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@/test-utils'
import Moderation from './moderation'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

test('renders moderation section with title and info paragraphs', () => {
	render(<Moderation />)
	const moderationSection = screen.getByTestId('about-moderation-1')
	expect(moderationSection).toBeInTheDocument()

	expect(screen.getByText('about.moderation.moderation')).toBeInTheDocument()

	const infoParagraphs = moderationSection.querySelectorAll(
		"p[role='paragraph']",
	)
	expect(infoParagraphs).toHaveLength(4)
	expect(infoParagraphs[0]).toHaveTextContent('about.moderation.info-1')
	expect(infoParagraphs[1]).toHaveTextContent('about.moderation.info-2')
})

it('Should not have a11y violation', async () => {
	const { container } = render(<Moderation />)
	const result = await axe(container)
	expect(result).toHaveNoViolations()
})
