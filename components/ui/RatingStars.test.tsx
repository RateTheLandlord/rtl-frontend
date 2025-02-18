/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@/test-utils'
import RatingStars from './RatingStars'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('RatingStars', () => {
	it('renders the correct number of filled stars', () => {
		const { getByTestId } = render(
			<RatingStars value={3} testid='rating-stars' />,
		)
		const ratingStars = getByTestId('rating-stars')
		const filledStars = ratingStars.querySelectorAll('.text-yellow-400')
		expect(filledStars.length).toBe(3)
	})

	it('renders the correct number of empty stars', () => {
		const { getByTestId } = render(
			<RatingStars value={2} testid='rating-stars' />,
		)
		const ratingStars = getByTestId('rating-stars')
		const emptyStars = ratingStars.querySelectorAll('.text-gray-300')
		expect(emptyStars.length).toBe(3)
	})

	it('renders all stars as empty when value is 0', () => {
		const { getByTestId } = render(
			<RatingStars value={0} testid='rating-stars' />,
		)
		const ratingStars = getByTestId('rating-stars')
		const emptyStars = ratingStars.querySelectorAll('.text-gray-300')
		expect(emptyStars.length).toBe(5)
	})

	it('renders all stars as filled when value is 5', () => {
		const { getByTestId } = render(
			<RatingStars value={5} testid='rating-stars' />,
		)
		const ratingStars = getByTestId('rating-stars')
		const filledStars = ratingStars.querySelectorAll('.text-yellow-400')
		expect(filledStars.length).toBe(5)
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<RatingStars value={3} testid='rating-stars' />,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
