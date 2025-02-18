/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
import ReviewHero from './ReviewHero'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('ReviewHero', () => {
	it('renders the hero header', () => {
		render(<ReviewHero />)
		expect(screen.getByText('reviews.hero_header')).toBeInTheDocument()
	})

	it('renders the hero body', () => {
		render(<ReviewHero />)
		expect(screen.getByText('reviews.hero_body')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<ReviewHero />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
