/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import Testimonials from './testimonials'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Testimonials', () => {
	test('Testimonials component renders correctly', () => {
		render(<Testimonials />)

		// Ensure the component renders
		const testimonialsSection = screen.getByTestId('home-testimonial')
		expect(testimonialsSection).toBeInTheDocument()

		// Ensure each testimonial is rendered
		const testimonial1 = screen.getByText(/sounds like a great initiative/i)
		expect(testimonial1).toBeInTheDocument()

		const testimonial2 = screen.getByText(/I love this idea./i)
		expect(testimonial2).toBeInTheDocument()

		const testimonial3 = screen.getByText(/Been dreaming of this years!/i)
		expect(testimonial3).toBeInTheDocument()

		const testimonial4 = screen.getByText(/I consider your work heroic/i)
		expect(testimonial4).toBeInTheDocument()

		const testimonial5 = screen.getByText(/Good. As a landlord myself/i)
		expect(testimonial5).toBeInTheDocument()

		const testimonial6 = screen.getByText(/This is a much needed service./i)
		expect(testimonial6).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<Testimonials />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
