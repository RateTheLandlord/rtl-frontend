/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import Faq from '@/components/about/faq'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

test('FAQ component renders', () => {
	render(<Faq />)
	expect(screen.getByTestId('about-faq-1')).toBeInTheDocument()
})

it('Should not have a11y violation', async () => {
	const { container } = render(<Faq />)
	const result = await axe(container)
	expect(result).toHaveNoViolations()
})
