/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import ResourceMobileFilters from './resource-mobile-filters'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('ResourceMobileFilters', () => {
	const defaultProps = {
		mobileFiltersOpen: true,
		setMobileFiltersOpen: jest.fn(),
		countryFilter: null,
		stateFilter: null,
		cityFilter: null,
		cityOptions: [],
		stateOptions: [],
		updateParams: jest.fn(),
	}

	it('Should not have a11y violation', async () => {
		const { container } = render(<ResourceMobileFilters {...defaultProps} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
