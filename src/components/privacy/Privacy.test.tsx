/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@/test-utils'
import Privacy from './Privacy'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Privacy Component', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(<Privacy />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
