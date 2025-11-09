/**
 * @jest-environment jsdom
 */
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import WrittenReviewForm from './WrittenReviewForm'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateReview } from '@/redux/review/reviewSlice'
import { useTranslations } from 'next-intl'

// ─── Mocks ───────────────────────────────────────────────
jest.mock('@/redux/hooks', () => ({
	useAppDispatch: jest.fn(),
	useAppSelector: jest.fn(),
}))
jest.mock('@/redux/review/reviewSlice', () => ({
	updateReview: jest.fn((str: string) => ({
		type: 'updateReview',
		payload: str,
	})),
}))
jest.mock('posthog-js', () => ({
	capture: jest.fn(),
}))
jest.mock('next-intl', () => ({
	useTranslations: jest.fn(),
}))
jest.mock(
	'@/components/ui/button',
	() =>
		(props: {
			onClick: () => void
			disabled: boolean
			children: JSX.Element
		}) => (
			<button onClick={props.onClick} disabled={props.disabled}>
				{props.children}
			</button>
		),
)
jest.mock(
	'@/components/ui/LargeTextInput',
	() =>
		(props: {
			testid: string
			value: string
			placeHolder: string
			setValue: (str: string) => void
		}) => (
			<textarea
				data-testid={props.testid}
				value={props.value}
				placeholder={props.placeHolder}
				onChange={(e) => props.setValue(e.target.value)}
			/>
		),
)

// ─── Test Suite ───────────────────────────────────────────
describe('WrittenReviewForm', () => {
	const mockDispatch = jest.fn()
	const mockSetReviewOpen = jest.fn()
	const mockSetShowPreview = jest.fn()
	const mockT = jest.fn((key: string, vars?: string[]) => {
		if (key === 'review-form.limit') return `Limit: ${vars?.length || 0}`
		return key
	})

	beforeEach(() => {
		jest.clearAllMocks()
		;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
		;(useAppSelector as jest.Mock).mockReturnValue({
			review: 'Good landlord overall.',
		})
		;(useTranslations as jest.Mock).mockReturnValue(mockT)
	})

	it('renders collapsed view when reviewOpen is false', () => {
		render(
			<WrittenReviewForm
				reviewOpen={false}
				setReviewOpen={mockSetReviewOpen}
				setShowPreview={mockSetShowPreview}
			/>,
		)

		expect(screen.getByText('written-review.title')).toBeInTheDocument()
		expect(screen.getByText('Good landlord overall.')).toBeInTheDocument()
		expect(screen.getByText('edit')).toBeInTheDocument()
	})

	it('calls setReviewOpen(true) when edit button clicked', () => {
		render(
			<WrittenReviewForm
				reviewOpen={false}
				setReviewOpen={mockSetReviewOpen}
				setShowPreview={mockSetShowPreview}
			/>,
		)

		fireEvent.click(screen.getByText('edit'))
		expect(mockSetReviewOpen).toHaveBeenCalledWith(true)
	})

	it('renders full form when reviewOpen is true', () => {
		render(
			<WrittenReviewForm
				reviewOpen={true}
				setReviewOpen={mockSetReviewOpen}
				setShowPreview={mockSetShowPreview}
			/>,
		)

		expect(
			screen.getByTestId('WrittenReviewForm-component'),
		).toBeInTheDocument()
		expect(screen.getByTestId('create-review-form-text-1')).toBeInTheDocument()
		expect(
			screen.getByText('written-review.preview-review'),
		).toBeInTheDocument()
	})

	it('dispatches updateReview when typing in textarea', () => {
		render(
			<WrittenReviewForm
				reviewOpen={true}
				setReviewOpen={mockSetReviewOpen}
				setShowPreview={mockSetShowPreview}
			/>,
		)

		const textarea = screen.getByTestId('create-review-form-text-1')
		fireEvent.change(textarea, { target: { value: 'Updated review' } })

		expect(mockDispatch).toHaveBeenCalledWith(updateReview('Updated review'))
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<WrittenReviewForm
				reviewOpen={true}
				setReviewOpen={mockSetReviewOpen}
				setShowPreview={mockSetShowPreview}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
