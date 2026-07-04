/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, within } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import ReviewForm from './review-form'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

// Mocking useRouter hook
jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

// Mocking fetch globally for the test
beforeAll(() => {
	global.fetch = jest.fn((input: RequestInfo) => {
		const url = typeof input === 'string' ? input : input.url
		if (url.includes('/api/review/get-landlord-suggestions')) {
			return Promise.resolve({
				ok: true,
				json: jest.fn().mockResolvedValue([]),
			})
		}
		if (url.includes('nominatim.openstreetmap.org/search')) {
			return Promise.resolve({
				ok: true,
				json: jest.fn().mockResolvedValue([]),
			})
		}
		if (url.includes('/api/review/submit-review')) {
			return Promise.resolve({
				ok: true,
				json: jest.fn().mockResolvedValue({
					success: true,
					user_code: 'mock-user-code',
					review_id: 1,
				}),
			})
		}
		return Promise.resolve({
			ok: true,
			json: jest.fn().mockResolvedValue({}),
		})
	}) as unknown as typeof global.fetch
})

afterAll(() => {
	jest.restoreAllMocks() // Optionally restore the original fetch after the tests
})

describe('create-review/ReviewForm component should submit multi-step create-review ReviewForm', () => {
	it('should render ReviewForm component and insert data as a user would. Then, it should submit review.', async () => {
		//Render ReviewForm
		render(<ReviewForm />)

		const reviewFormComponent = screen.getByTestId('create-review-form-1')
		expect(reviewFormComponent).toBeInTheDocument()

		//Check for LandlordForm component directly
		const landlordFormComponent = screen.getByTestId('LandlordForm-component')
		expect(landlordFormComponent).toBeInTheDocument()

		//Check for LandlordForm component
		const landlordComboBoxComponent = screen.getByTestId(
			'LandlordComboBox-component',
		)
		// Simulate typing "John Doe" into the LandlordComboBox
		await userEvent.type(landlordComboBoxComponent, 'John Doe')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect((landlordComboBoxComponent as HTMLInputElement).value).toBe(
			'John Doe',
		)

		//Check for LocationForm component
		const locationFormComponent = screen.getByTestId('LocationForm-component')
		expect(locationFormComponent).toBeInTheDocument()

		//Check for CountrySelector component
		const countrySelectorComponent = screen.getByTestId('country-selector')
		expect(countrySelectorComponent).toBeInTheDocument()
		await userEvent.selectOptions(countrySelectorComponent, 'US')
		expect((countrySelectorComponent as HTMLSelectElement).value).toBe('US')

		//Check for StateSelector component
		const stateSelectorComponent = screen.getByTestId('StateSelector-component')
		expect(stateSelectorComponent).toBeInTheDocument()
		await userEvent.selectOptions(stateSelectorComponent, 'Alabama')
		expect((stateSelectorComponent as HTMLSelectElement).value).toBe('ALABAMA')

		//Check for Rent Amount TextInput component
		const rentInputComponent = screen.getByTestId(
			'create-review-form-rent-1input',
		)
		expect(rentInputComponent).toBeInTheDocument()
		await userEvent.type(rentInputComponent, '2500')
		expect((rentInputComponent as HTMLInputElement).value).toBe('2500')

		//Check for City ComboBox component
		const cityComboBoxComponent = screen.getByTestId('CityComboBox-component')
		expect(cityComboBoxComponent).toBeInTheDocument()
		await userEvent.type(cityComboBoxComponent, 'Chicago')
		expect((cityComboBoxComponent as HTMLInputElement).value).toBe('Chicago')

		//Check for ZIP/Postal-Code TextInput component
		const zipInputComponent = screen.getByTestId(
			'create-review-form-postal-code-1input',
		)
		expect(zipInputComponent).toBeInTheDocument()
		await userEvent.type(zipInputComponent, '60618')
		expect((zipInputComponent as HTMLInputElement).value).toBe('60618')

		//Check for RatingForm component
		const ratingFormComponent = screen.getByTestId('rating-form-grid')
		expect(ratingFormComponent).toBeInTheDocument()

		const repairRatingGroup = within(
			screen.getByTestId('RepairRatingsRadio-component'),
		)
		const healthRatingGroup = within(
			screen.getByTestId('HealthRatingsRadio-component'),
		)
		const stabilityRatingGroup = within(
			screen.getByTestId('StabilityRatingsRadio-component'),
		)
		const privacyRatingGroup = within(
			screen.getByTestId('PrivacyRatingsRadio-component'),
		)
		const respectRatingGroup = within(
			screen.getByTestId('RespectRatingsRadio-component'),
		)

		const repairRating1 = repairRatingGroup.getByRole('radio', { name: /1/ })
		const healthRating2 = healthRatingGroup.getByRole('radio', { name: /2/ })
		const stabilityRating3 = stabilityRatingGroup.getByRole('radio', {
			name: /3/,
		})
		const privacyRating4 = privacyRatingGroup.getByRole('radio', { name: /4/ })
		const respectRating5 = respectRatingGroup.getByRole('radio', { name: /5/ })

		await userEvent.click(repairRating1)
		await userEvent.click(healthRating2)
		await userEvent.click(stabilityRating3)
		await userEvent.click(privacyRating4)
		await userEvent.click(respectRating5)

		//Check for WrittenReviewForm component
		const writtenReviewFormComponent = screen.getByTestId(
			'WrittenReviewForm-component',
		)
		expect(writtenReviewFormComponent).toBeInTheDocument()

		const writtenReviewLargeTextInputComponent = screen.getByTestId(
			'create-review-form-text-1',
		)
		expect(writtenReviewLargeTextInputComponent).toBeInTheDocument()
		await userEvent.type(
			writtenReviewLargeTextInputComponent,
			'This is a test review written as part of components/create-review/review-form.test.tsx',
		)
		expect(
			(writtenReviewLargeTextInputComponent as HTMLTextAreaElement).value,
		).toBe(
			'This is a test review written as part of components/create-review/review-form.test.tsx',
		)

		//Check for Submit Review button
		const submitReviewButton = screen.getByText(
			'createreview.review-form.submit',
		)
		expect(submitReviewButton).toBeInTheDocument()
		expect(submitReviewButton).toBeEnabled()

		await userEvent.click(submitReviewButton)
		expect(global.fetch).toHaveBeenCalledWith(
			'/api/review/submit-review',
			expect.objectContaining({
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			}),
		)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<ReviewForm />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
