/**
 * @jest-environment jsdom
 */
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
import { render, screen } from '@testing-library/react'
import ReviewPreview from './ReviewPreview'

jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key, // Mock translation function
	}),
}))

describe('ReviewPreview Component', () => {
	const defaultProps = {
		review: 'This is a sample review.',
		health: 4,
		respect: 5,
		privacy: 3,
		repair: 4,
		stability: 5,
		landlord: 'John Doe',
		city: 'New York',
		state: 'NY',
		country_code: 'US',
		zip: '10001',
		rent: 1500,
	}

	it('renders the ReviewPreview component', () => {
		render(<ReviewPreview {...defaultProps} />)

		expect(screen.getByTestId('ReviewPreview-component')).toBeInTheDocument()
	})

	it('displays the landlord name', () => {
		render(<ReviewPreview {...defaultProps} />)

		expect(screen.getByTestId('ReviewPreview-Landlord')).toHaveTextContent(
			'John Doe',
		)
	})

	it('displays the location correctly', () => {
		render(<ReviewPreview {...defaultProps} />)

		expect(screen.getByTestId('ReviewPreview-Location')).toHaveTextContent(
			'New York, NY, US, 10001',
		)
	})

	it('displays the ratings correctly', () => {
		render(<ReviewPreview {...defaultProps} />)

		expect(screen.getByTestId('HealthReviewPreviewRating')).toBeInTheDocument()
		expect(screen.getByTestId('RespectReviewPreviewRating')).toBeInTheDocument()
		expect(screen.getByTestId('PrivacyReviewPreviewRating')).toBeInTheDocument()
		expect(screen.getByTestId('RepairReviewPreviewRating')).toBeInTheDocument()
		expect(
			screen.getByTestId('StabilityReviewPreviewRating'),
		).toBeInTheDocument()
	})

	it('displays the rent price when provided', () => {
		render(<ReviewPreview {...defaultProps} />)

		expect(screen.getByTestId('ReviewPreviewRent')).toHaveTextContent(
			'reviews.rent1500',
		)
	})

	it('does not render rent section when rent is null', () => {
		render(<ReviewPreview {...defaultProps} rent={null} />)

		expect(screen.queryByTestId('ReviewPreviewRent')).not.toBeInTheDocument()
	})

	it('displays the written review', () => {
		render(<ReviewPreview {...defaultProps} />)

		expect(screen.getByTestId('WrittenReviewPreview')).toHaveTextContent(
			'This is a sample review.',
		)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<ReviewPreview {...defaultProps} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
