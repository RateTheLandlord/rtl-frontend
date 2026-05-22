/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
import Footer from './footer'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Footer', () => {
	test('renders the footer links', () => {
		render(<Footer />)

		const instagramLink = screen.getByRole('link', { name: 'Instagram' })
		expect(instagramLink).toBeInTheDocument()
		expect(instagramLink).toHaveAttribute(
			'href',
			'https://www.instagram.com/ratethelandlord',
		)

		const githubLink = screen.getByRole('link', { name: 'Github' })
		expect(githubLink).toBeInTheDocument()
		expect(githubLink).toHaveAttribute(
			'href',
			'https://github.com/RateTheLandlord',
		)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<Footer />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
