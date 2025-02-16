/**
 * @jest-environment jsdom
 */
import { fireEvent, screen } from '@/test-utils'
import RatingForm from './RatingForm'
import { axe, toHaveNoViolations } from 'jest-axe'
import { render } from '@/test-utils'
expect.extend(toHaveNoViolations)

jest.mock('@/components/ui/button', () =>
	jest.fn(({ children, ...props }) => <button {...props}>{children}</button>),
)

jest.mock('@/components/ui/RatingStars', () =>
	jest.fn(() => <div>RatingStars</div>),
)
jest.mock('../ratings-radio', () => jest.fn(() => <div>RatingsRadio</div>))

describe('RatingForm Component', () => {
	const mockSetRatingsOpen = jest.fn()
	const mockSetRepair = jest.fn()
	const mockSetHealth = jest.fn()
	const mockSetStability = jest.fn()
	const mockSetPrivacy = jest.fn()
	const mockSetRespect = jest.fn()
	const mockSetShowReviewForm = jest.fn()
	const mockSetReviewOpen = jest.fn()

	const defaultProps = {
		ratingsOpen: false,
		ratings: [
			{ title: 'Repair', rating: 4 },
			{ title: 'Health', rating: 3 },
			{ title: 'Privacy', rating: 5 },
		],
		repair: 4,
		health: 3,
		stability: 5,
		privacy: 4,
		respect: 5,
		setRatingsOpen: mockSetRatingsOpen,
		setRepair: mockSetRepair,
		setHealth: mockSetHealth,
		setStability: mockSetStability,
		setPrivacy: mockSetPrivacy,
		setRespect: mockSetRespect,
		setShowReviewForm: mockSetShowReviewForm,
		setReviewOpen: mockSetReviewOpen,
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should render ratings info and Edit button when ratingsOpen is false', () => {
		render(<RatingForm {...defaultProps} />)

		expect(
			screen.getByText('createreview.ratings-form.title'),
		).toBeInTheDocument()
		expect(screen.getByText('Repair')).toBeInTheDocument()
		expect(screen.getByText('Health')).toBeInTheDocument()
		expect(screen.getByText('Privacy')).toBeInTheDocument()
		expect(screen.getAllByText('RatingStars')).toHaveLength(3)
		expect(screen.getByText('createreview.edit')).toBeInTheDocument()
	})

	it('should call setRatingsOpen(true) when Edit button is clicked', () => {
		render(<RatingForm {...defaultProps} />)

		fireEvent.click(screen.getByText('createreview.edit'))

		expect(mockSetRatingsOpen).toHaveBeenCalledWith(true)
	})

	it('should render RatingsRadio components when ratingsOpen is true', () => {
		render(<RatingForm {...defaultProps} ratingsOpen={true} />)

		expect(screen.getAllByText('RatingsRadio')).toHaveLength(5) // One for each rating (Repair, Health, Stability, Privacy, Respect)
	})

	it('should call setShowReviewForm, setRatingsOpen(false), and setReviewOpen(true) when Continue button is clicked', () => {
		render(<RatingForm {...defaultProps} ratingsOpen={true} />)

		fireEvent.click(screen.getByText('createreview.continue'))

		expect(mockSetShowReviewForm).toHaveBeenCalledWith(true)
		expect(mockSetRatingsOpen).toHaveBeenCalledWith(false)
		expect(mockSetReviewOpen).toHaveBeenCalledWith(true)
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<RatingForm {...defaultProps} ratingsOpen={true} />,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
