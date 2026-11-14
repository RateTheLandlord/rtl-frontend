/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render } from '@testing-library/react'
import Logo from './logo'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Logo', () => {
	it('renders an inline SVG', () => {
		const { container } = render(<Logo />)
		const svg = container.querySelector('svg')
		expect(svg).not.toBeNull()
	})

	it('a11y: has no accessibility violations', async () => {
		const { container } = render(<Logo />)
		const results = await axe(container)
		expect(results).toHaveNoViolations()
	})
})
