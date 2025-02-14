/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import SuspiciousLandlords from './SuspiciousLandlords'
import { axe } from 'jest-axe'

describe('SuspiciousLandlords', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(<SuspiciousLandlords />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
