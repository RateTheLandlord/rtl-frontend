/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import AnalyticsComponent, { QueryParams } from './analytics'
expect.extend(toHaveNoViolations)

const mockData: QueryParams = {
	sort: 'new',
	state: 'on',
	country: 'ca',
	city: 'toronto',
	zip: 'h0h0h0',
	search: '',
	limit: '1000',
}

it('Should not have a11y violation', async () => {
	const { container } = render(<AnalyticsComponent queryParams={mockData} />)
	const result = await axe(container)
	expect(result).toHaveNoViolations()
})
