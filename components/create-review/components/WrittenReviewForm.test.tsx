/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import WrittenReviewForm from './WrittenReviewForm'

jest.mock('@/components/ui/button', () =>
	jest.fn(({ children, ...props }) => <button {...props}>{children}</button>),
)

jest.mock('@/components/ui/LargeTextInput', () =>
	jest.fn(({ value, setValue }) => (
		<textarea value={value} onChange={(e) => setValue(e.target.value)} />
	)),
)

jest.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, options?: any) =>
			key === 'create-review.review-form.limit'
				? `Limit ${options?.length}/2000`
				: key,
	}),
}))

describe('WrittenReviewForm Component', () => {
	const mockSetReviewOpen = jest.fn()
	const mockHandleTextChange = jest.fn()
	const mockSetShowPreview = jest.fn()

	const defaultProps = {
		reviewOpen: false,
		review: 'This is a test review.',
		setReviewOpen: mockSetReviewOpen,
		handleTextChange: mockHandleTextChange,
		setShowPreview: mockSetShowPreview,
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should render review text and Edit button when reviewOpen is false', () => {
		render(<WrittenReviewForm {...defaultProps} />)

		expect(screen.getByText('Review')).toBeInTheDocument()
		expect(screen.getByText('This is a test review.')).toBeInTheDocument()
		expect(screen.getByText('Edit')).toBeInTheDocument()
	})

	it('should call setReviewOpen(true) when Edit button is clicked', () => {
		render(<WrittenReviewForm {...defaultProps} />)

		fireEvent.click(screen.getByText('Edit'))
		expect(mockSetReviewOpen).toHaveBeenCalledWith(true)
	})

	it('should render the review form and preview button when reviewOpen is true', () => {
		render(<WrittenReviewForm {...defaultProps} reviewOpen={true} />)

		expect(
			screen.getByText('Please follow our moderation policy:'),
		).toBeInTheDocument()
		expect(screen.getByRole('textbox')).toBeInTheDocument()
		expect(screen.getByText('Preview Review')).toBeInTheDocument()
	})

	it('should call handleTextChange when LargeTextInput value changes', () => {
		render(<WrittenReviewForm {...defaultProps} reviewOpen={true} />)

		fireEvent.change(screen.getByRole('textbox'), {
			target: { value: 'Updated review' },
		})
		expect(mockHandleTextChange).toHaveBeenCalledWith(
			'Updated review',
			'review',
		)
	})

	it('should call setShowPreview(true) and setReviewOpen(false) when Preview Review button is clicked', () => {
		render(<WrittenReviewForm {...defaultProps} reviewOpen={true} />)

		fireEvent.click(screen.getByText('Preview Review'))
		expect(mockSetShowPreview).toHaveBeenCalledWith(true)
		expect(mockSetReviewOpen).toHaveBeenCalledWith(false)
	})

	it('should disable Preview Review button when review is empty', () => {
		render(<WrittenReviewForm {...defaultProps} reviewOpen={true} review='' />)

		expect(screen.getByText('Preview Review')).toBeDisabled()
	})
})
