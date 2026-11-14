/**
 * @jest-environment jsdom
 */
import { screen } from '@/test-utils'
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
	it('renders the rating controls and rent input', () => {
		render(<RatingForm />)

		expect(screen.getAllByText('RatingsRadio')).toHaveLength(5)
		expect(screen.getByTestId('create-review-form-rent-1')).toBeInTheDocument()
	})

	it('uses a mobile-friendly responsive grid for rating inputs', () => {
		render(<RatingForm />)

		const ratingGrid = screen.getByTestId('rating-form-grid')
		expect(ratingGrid).toHaveClass('grid-cols-1')
		expect(ratingGrid).toHaveClass('sm:grid-cols-2')
		expect(ratingGrid).toHaveClass('xl:grid-cols-3')
	})

	it('should not have a11y violation', async () => {
		const { container } = render(<RatingForm />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
