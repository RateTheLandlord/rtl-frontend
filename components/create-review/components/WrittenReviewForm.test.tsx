/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@/test-utils'
import WrittenReviewForm from './WrittenReviewForm'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('@/components/ui/button', () =>
	jest.fn(({ children, ...props }) => <button {...props}>{children}</button>),
)

jest.mock('@/components/ui/LargeTextInput', () =>
	jest.fn(
		({
			value,
			setValue,
		}: {
			value: string
			setValue: (value: string) => void
		}) => (
			<textarea
				aria-label='TEST TEXT AREA'
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
		),
	),
)

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

		expect(
			screen.getByText('createreview.written-review.title'),
		).toBeInTheDocument()
		expect(screen.getByText('This is a test review.')).toBeInTheDocument()
		expect(screen.getByText('createreview.edit')).toBeInTheDocument()
	})

	it('should call setReviewOpen(true) when Edit button is clicked', () => {
		render(<WrittenReviewForm {...defaultProps} />)

		fireEvent.click(screen.getByText('createreview.edit'))
		expect(mockSetReviewOpen).toHaveBeenCalledWith(true)
	})

	it('should render the review form and preview button when reviewOpen is true', () => {
		render(<WrittenReviewForm {...defaultProps} reviewOpen={true} />)

		expect(
			screen.getByText('createreview.written-review.policy-1'),
		).toBeInTheDocument()
		expect(screen.getByRole('textbox')).toBeInTheDocument()
		expect(
			screen.getByText('createreview.written-review.preview-review'),
		).toBeInTheDocument()
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

		fireEvent.click(
			screen.getByText('createreview.written-review.preview-review'),
		)
		expect(mockSetShowPreview).toHaveBeenCalledWith(true)
		expect(mockSetReviewOpen).toHaveBeenCalledWith(false)
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<WrittenReviewForm {...defaultProps} reviewOpen={true} />,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
