/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import { SuspiciousLandlord } from '@/util/interfaces/interfaces'
import LandlordBanner from './LandlordBanner'
expect.extend(toHaveNoViolations)

describe('LandlordBanner', () => {
	const landlord: SuspiciousLandlord = {
		landlord: 'Test Landlord',
		message: 'This is a suspicious landlord message',
	}
	it('renders the landlord message', () => {
		render(<LandlordBanner landlord={landlord} />)

		const messageElement = screen.getByText(
			'This is a suspicious landlord message',
		)
		expect(messageElement).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<LandlordBanner landlord={landlord} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
