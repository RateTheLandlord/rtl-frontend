/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import TotalStats from './TotalStats'
import { ICountryStats } from '../types/types'
import { axe } from 'jest-axe'

const mockData: ICountryStats = {
	total_reviews: 1000,
	countryStats: {
		CA: { total: '100', states: [] },
		US: { total: '200', states: [] },
		GB: { total: '150', states: [] },
		AU: { total: '50', states: [] },
		NZ: { total: '30', states: [] },
		DE: { total: '70', states: [] },
		IE: { total: '20', states: [] },
		NO: { total: '10', states: [] },
	},
}

describe('TotalStats Component', () => {
	it('renders total reviews', () => {
		render(<TotalStats data={mockData} />)
		expect(screen.getByText('Total Reviews')).toBeInTheDocument()
		expect(screen.getByText('1000')).toBeInTheDocument()
	})

	it('renders country stats', () => {
		render(<TotalStats data={mockData} />)
		expect(screen.getByText('Canadian Reviews')).toBeInTheDocument()
		expect(screen.getByText('100')).toBeInTheDocument()
		expect(screen.getByText('US Reviews')).toBeInTheDocument()
		expect(screen.getByText('200')).toBeInTheDocument()
		expect(screen.getByText('UK Reviews')).toBeInTheDocument()
		expect(screen.getByText('150')).toBeInTheDocument()
		expect(screen.getByText('Australia Reviews')).toBeInTheDocument()
		expect(screen.getByText('50')).toBeInTheDocument()
		expect(screen.getByText('New Zealand Reviews')).toBeInTheDocument()
		expect(screen.getByText('30')).toBeInTheDocument()
		expect(screen.getByText('Germany Reviews')).toBeInTheDocument()
		expect(screen.getByText('70')).toBeInTheDocument()
		expect(screen.getByText('Ireland Reviews')).toBeInTheDocument()
		expect(screen.getByText('20')).toBeInTheDocument()
		expect(screen.getByText('Norway Reviews')).toBeInTheDocument()
		expect(screen.getByText('10')).toBeInTheDocument()
	})

	it('handles country click and renders state stats', () => {
		render(<TotalStats data={mockData} />)
		fireEvent.click(screen.getByText('Canadian Reviews'))
		expect(screen.getByText('Canadian Reviews').closest('div')).toHaveClass(
			'bg-gray-200',
		)
		fireEvent.click(screen.getByText('US Reviews'))
		expect(screen.getByText('US Reviews').closest('div')).toHaveClass(
			'bg-gray-200',
		)
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<TotalStats data={mockData} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
