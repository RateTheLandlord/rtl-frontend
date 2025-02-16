/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'
import Sidebar from './sidebar'
import { AnalyticsResponse } from '@/lib/analytics/types'
expect.extend(toHaveNoViolations)

const mockData: AnalyticsResponse = {
	avgRatingT90: 1,
	avgRatingT180: 2,
	avgRatingT365: 3,
	medianRentT90: 4,
	medianRentT180: 5,
	medianRentT365: 6,
}

it('Should not have a11y violation', async () => {
	const { container } = render(
		<Sidebar data={mockData} handleClick={() => jest.fn()} />,
	)
	const result = await axe(container)
	expect(result).toHaveNoViolations()
})
