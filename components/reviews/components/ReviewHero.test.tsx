/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import ReviewHero from './ReviewHero'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

// Mock the useTranslation hook
jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

describe('ReviewHero', () => {
	it('renders the hero header', () => {
		const { getByText } = render(<ReviewHero />)
		expect(getByText('reviews.hero_header')).toBeInTheDocument()
	})

	it('renders the hero body', () => {
		const { getByText } = render(<ReviewHero />)
		expect(getByText('reviews.hero_body')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<ReviewHero />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
