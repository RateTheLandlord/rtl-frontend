/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
import Terms from './Terms'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Terms Component', () => {
	test('renders Acceptance of Terms section', () => {
		render(<Terms />)
		const acceptanceHeading = screen.getByText(/1. Acceptance of Terms/i)
		const acceptanceText = screen.getByText(
			/By accessing or using ratethelandlord.org, you agree to be bound by these Terms and Conditions and all applicable laws and regulations./i,
		)
		expect(acceptanceHeading).toBeInTheDocument()
		expect(acceptanceText).toBeInTheDocument()
	})

	test('renders Use of Content section', () => {
		render(<Terms />)
		const useOfContentHeading = screen.getByText(/2. Use of Content/i)
		const useOfContentText = screen.getByText(
			/All content provided on ratethelandlord.org is for informational purposes only./i,
		)
		expect(useOfContentHeading).toBeInTheDocument()
		expect(useOfContentText).toBeInTheDocument()
	})

	test('renders Disclaimer section', () => {
		render(<Terms />)
		const disclaimerHeading = screen.getByText(/3. Disclaimer/i)
		const disclaimerText = screen.getByText(
			/The information provided on ratethelandlord.org is provided "as is" without any representations or warranties, express or implied./i,
		)
		expect(disclaimerHeading).toBeInTheDocument()
		expect(disclaimerText).toBeInTheDocument()
	})

	test('renders Limitations of Liability section', () => {
		render(<Terms />)
		const limitationsHeading = screen.getByText(/4. Limitations of Liability/i)
		const limitationsText = screen.getByText(
			/In no event shall ratethelandlord.org be liable for any damages arising out of the use or inability to use the materials on ratethelandlord.org/i,
		)
		expect(limitationsHeading).toBeInTheDocument()
		expect(limitationsText).toBeInTheDocument()
	})

	test('renders Links to Third-Party Websites section', () => {
		render(<Terms />)
		const linksHeading = screen.getByText(/5. Links to Third-Party Websites/i)
		const linksText = screen.getByText(
			/ratethelandlord.org may contain links to third-party websites or services that are not owned or controlled by ratethelandlord.org./i,
		)
		expect(linksHeading).toBeInTheDocument()
		expect(linksText).toBeInTheDocument()
	})

	test('renders Governing Law section', () => {
		render(<Terms />)
		const governingLawHeading = screen.getByText(/6. Governing Law/i)
		const governingLawText = screen.getByText(
			/Any claim relating to ratethelandlord.org's website shall be governed by the laws of the jurisdiction of ratethelandlord.org's location without regard to its conflict of law provisions./i,
		)
		expect(governingLawHeading).toBeInTheDocument()
		expect(governingLawText).toBeInTheDocument()
	})

	test('renders Modifications section', () => {
		render(<Terms />)
		const modificationsHeading = screen.getByText(/7. Modifications/i)
		const modificationsText = screen.getByText(
			/ratethelandlord.org may revise these terms of service for its website at any time without notice./i,
		)
		expect(modificationsHeading).toBeInTheDocument()
		expect(modificationsText).toBeInTheDocument()
	})

	test('renders Contact Information section', () => {
		render(<Terms />)
		const contactInfoHeading = screen.getByText(/8. Contact Information/i)
		const contactInfoText = screen.getByText(
			/If you have any questions about these Terms and Conditions, please contact us at contact@ratethelandlord.org./i,
		)
		expect(contactInfoHeading).toBeInTheDocument()
		expect(contactInfoText).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<Terms />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
