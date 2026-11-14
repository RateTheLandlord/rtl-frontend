/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'
import AnalyticsComponent from './analytics'
import { ISortOptions } from '../reviews/review'
expect.extend(toHaveNoViolations)

const mockData = {
	sort: 'az' as ISortOptions,
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
