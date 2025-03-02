/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import { HouseIcon } from './HouseIcon'
import { axe } from 'jest-axe'

describe('HouseIcon', () => {
	it('should render the SVG with fill set to none', () => {
		const { container } = render(<HouseIcon />)
		const svgElement = container.querySelector('svg')
		expect(svgElement).toBeInTheDocument()
		expect(svgElement).toHaveAttribute('fill', 'none')
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<HouseIcon />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
