/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import TenantResources from './TenantResources'
import { axe } from 'jest-axe'

describe('TenantResources', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(<TenantResources />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
