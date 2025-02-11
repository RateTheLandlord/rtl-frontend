/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import Hero from '@/components/home/hero'
import IconSection from '@/components/home/icon-section'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Homepage', () => {
	test('Hero component renders', () => {
		render(<Hero />)
		expect(screen.getByTestId('home-hero-1')).toBeInTheDocument()
	})
	test('Icon section component renders', () => {
		render(<IconSection />)
		expect(screen.getByTestId('home-icon-section-1')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<Hero />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
