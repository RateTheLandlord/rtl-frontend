/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import RatingsRadio from './ratings-radio'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('RatingsRadio component', () => {
	const setRatingMock = jest.fn()
	const title = 'Rating Title'
	const rating = 3
	const tooltip = 'Tooltip text'
	test('should handle rating changes correctly', () => {
		const { getByText } = render(
			<RatingsRadio
				title={title}
				rating={rating}
				setRating={setRatingMock}
				tooltip={tooltip}
				testid='RatingsRadioUnitTest'
			/>,
		)

		fireEvent.click(getByText('4'))

		expect(setRatingMock).toHaveBeenCalledWith(4)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<RatingsRadio
				title={title}
				rating={rating}
				setRating={setRatingMock}
				tooltip={tooltip}
				testid='RatingsRadioUnitTest'
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
