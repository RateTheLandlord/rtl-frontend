/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import Supporters from './Supporters'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

const members = [
	{ id: 1, name: 'John Doe' },
	{ id: 2, name: 'Jane Smith' },
	{ id: 3, name: 'Alice Johnson' },
]

const tiers = [
	{ id: 1, name: 'Gold' },
	{ id: 2, name: 'Silver' },
	{ id: 3, name: 'Free' },
]

describe('Supporters Component', () => {
	test('renders the title', () => {
		render(<Supporters members={members} tiers={tiers} />)
		const titleElement = screen.getByText(/Our Generous Supporters/i)
		expect(titleElement).toBeInTheDocument()
	})

	test('renders the supporters with correct tier names', () => {
		render(<Supporters members={members} tiers={tiers} />)
		const johnDoeElement = screen.getByText('John Doe')
		const janeSmithElement = screen.getByText('Jane Smith')
		const goldTierElement = screen.getByText('Gold')
		const silverTierElement = screen.getByText('Silver')

		expect(johnDoeElement).toBeInTheDocument()
		expect(janeSmithElement).toBeInTheDocument()
		expect(goldTierElement).toBeInTheDocument()
		expect(silverTierElement).toBeInTheDocument()
	})

	test('does not render members with Free tier', () => {
		render(<Supporters members={members} tiers={tiers} />)
		const aliceJohnsonElement = screen.queryByText('Alice Johnson')
		expect(aliceJohnsonElement).toBeNull()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<Supporters members={members} tiers={tiers} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
