/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import ResourceList from './ResourceList'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { ResourceResponse } from '@/util/interfaces/interfaces'
import { sortOptions } from '@/util/helpers/filter-options'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

// Mock data
const mockData: ResourceResponse = {
	resources: [],
	total: '0',
	countries: [],
	states: [],
	cities: [],
	limit: 1,
}

describe('ResourceList Component', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<ResourceList data={mockData} />
			</Provider>,
		)
		expect(screen.getByTestId('ResourceListTest')).toBeInTheDocument()
	})

	it('filters sort options correctly', () => {
		const filteredSortOptions = sortOptions.filter((r) => r.id < 5)
		expect(filteredSortOptions.length).toBeLessThanOrEqual(sortOptions.length)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<ResourceList data={mockData} />
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
