/**
 * @jest-environment jsdom
 */
import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import ReviewForm from './review-form'

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('next/router', () => require('next-router-mock'))

beforeEach(() => {
	const mockIntersectionObserver = jest.fn()
	mockIntersectionObserver.mockReturnValue({
		observe: jest.fn().mockReturnValue(null),
		unobserve: jest.fn().mockReturnValue(null),
		disconnect: jest.fn().mockReturnValue(null),
	})
	window.IntersectionObserver = mockIntersectionObserver
})

test('Review Form component renders all fields', () => {
	const result = render(<ReviewForm />)

	expect(result.getByTestId('create-review-form-1')).toBeInTheDocument()
	expect(
		result.getByTestId('create-review-form-landlord-1'),
	).toBeInTheDocument()
	expect(result.getByTestId('create-review-form-city-1')).toBeInTheDocument()
	expect(
		result.getByTestId('create-review-form-postal-code-1'),
	).toBeInTheDocument()
	expect(result.getByTestId('create-review-form-text-1')).toBeInTheDocument()
	expect(
		result.getByTestId('create-review-form-submit-button-1'),
	).toBeInTheDocument()
})

test('Reset button clears the form', () => {
	const result = render(<ReviewForm />)

	const reviewText = result.getByTestId('create-review-form-text-1')
	fireEvent.change(reviewText, { target: { value: 'some review' } })

	const resetButton = result.getByTestId('light-button')
	fireEvent.click(resetButton)

	expect(reviewText).toHaveValue('')
})
