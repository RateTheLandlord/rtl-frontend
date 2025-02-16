/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
import Contact from './contact'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('react-i18next', () => ({
	useTranslations: jest.fn().mockReturnValue({
		t: jest.fn().mockImplementation((key) => {
			if (key === 'contact.title') {
				return 'Contact Us'
			} else if (key === 'contact.email') {
				return 'contact@ratethelandlord.org'
			}
		}),
	}),
}))

test('renders contact section with title and email', () => {
	render(<Contact />)
	const contactSection = screen.getByTestId('about-contact-1')
	expect(contactSection).toBeInTheDocument()

	expect(screen.getByText('about.contact.title')).toBeInTheDocument()

	const emailLink = contactSection.querySelector(
		"a[href='mailto:contact@ratethelandlord.org']",
	)
	expect(emailLink).toBeInTheDocument()
	expect(emailLink).toHaveTextContent('about.contact.email')
})

it('Should not have a11y violation', async () => {
	const { container } = render(<Contact />)
	const result = await axe(container)
	expect(result).toHaveNoViolations()
})
