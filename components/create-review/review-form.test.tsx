/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
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
	global.fetch = jest.fn().mockResolvedValue({
		json: jest.fn().mockResolvedValue({ data: 'some data' }),
	})
})

afterAll(() => {
	jest.restoreAllMocks() // Optionally restore the original fetch after the tests
})

// In your test file, mock the `next-recaptcha-v3` module
jest.mock('next-recaptcha-v3', () => ({
	// Mock the useReCaptcha hook correctly
	useReCaptcha: jest.fn().mockReturnValue({
		executeRecaptcha: jest.fn().mockResolvedValue('mock-token'),
		resetRecaptcha: jest.fn(),
	}),
	// If needed, you can also mock ReCaptcha component, but it may not be necessary for your tests
	ReCaptcha: () => null,
}))

jest.mock('react-i18next', () => ({
	useTranslation: jest.fn().mockReturnValue({
		t: jest.fn((key) => {
			if (key === 'create-review.hero.start') {
				return 'Start a Review'
			}
			if (key === 'create-review.hero.title') {
				return 'Help Us Create a Better Living Experience!'
			}
			if (key === 'create-review.hero.body') {
				return 'Thank you for reviewing your landlord! Your feedback on maintenance, communication, and overall satisfaction will help tenants in your area make informed housing decisions.'
			}
			if (key === 'create-review.continue') {
				return 'Continue'
			}
			if (key === 'create-review.written-review.title') {
				return 'Written Review'
			}
			if (key === 'create-review.written-review.policy-1') {
				return 'Please follow our moderation policy'
			}
			if (key === 'create-review.written-review.policy-2') {
				return 'Keep reviews civil and avoid including personal information such as addresses or phone numbers.'
			}
			if (key === 'create-review.written-review.policy-3') {
				return 'Avoid sharing personal details about yourself or your landlord that are not relevant to your rental experience.'
			}
			if (key === 'create-review.written-review.policy-4') {
				return 'Inappropriate content may be removed. Thank you for maintaining a safe and helpful community!'
			}
			if (key === 'create-review.written-review.preview-review') {
				return 'Preview Review'
			}
			if (key === 'reviews.rent') {
				return 'Rent Amount: $'
			}
			if (key === 'create-review.review-form.submit') {
				return 'Submit Review'
			}
			return ''
		}),
	}),
}))

describe('create-review/ReviewForm component should submit multi-step create-review ReviewForm', () => {
	it('should render ReviewForm component and insert data as a user would. Then, it should submit review.', async () => {
		//Render ReviewForm
		render(<ReviewForm />)

		const reviewFormComponent = screen.getByTestId('create-review-form-1')
		expect(reviewFormComponent).toBeInTheDocument()

		//Check for ReviewHero component
		const reviewHeroComponent = screen.getByTestId('ReviewHero-component')
		expect(reviewHeroComponent).toBeInTheDocument()

		//Check for HouseIcon component
		const houseIconComponent = screen.getByTestId('HouseIcon-component')
		expect(houseIconComponent).toBeInTheDocument()

		//Check if text renders
		expect(
			screen.getByText('Help Us Create a Better Living Experience!'),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				'Thank you for reviewing your landlord! Your feedback on maintenance, communication, and overall satisfaction will help tenants in your area make informed housing decisions.',
			),
		).toBeInTheDocument()

		//Check for Start a Review button
		const startReviewButton = screen.getByTestId('submit-button-1')
		expect(startReviewButton).toBeInTheDocument()
		await userEvent.click(startReviewButton)

		//Text should still be there
		expect(
			screen.getByText('Help Us Create a Better Living Experience!'),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				'Thank you for reviewing your landlord! Your feedback on maintenance, communication, and overall satisfaction will help tenants in your area make informed housing decisions.',
			),
		).toBeInTheDocument()

		//Check for LandlordForm component
		const landlordFormComponent = screen.getByTestId('LandlordForm-component')
		expect(landlordFormComponent).toBeInTheDocument()

		//Check for LandlordForm component
		const landlordComboBoxComponent = screen.getByTestId(
			'LandlordComboBox-component',
		) as HTMLInputElement
		// Simulate typing "John Doe" into the LandlordComboBox
		await userEvent.type(landlordComboBoxComponent, 'John Doe')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect(landlordComboBoxComponent.value).toBe('John Doe')

		//Check for Continue button
		const continueReviewButton = screen.getByText('Continue')
		expect(continueReviewButton).toBeInTheDocument()
		await userEvent.click(continueReviewButton)

		//Text should still be there
		expect(
			screen.getByText('Help Us Create a Better Living Experience!'),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				'Thank you for reviewing your landlord! Your feedback on maintenance, communication, and overall satisfaction will help tenants in your area make informed housing decisions.',
			),
		).toBeInTheDocument()

		//Check for LandlordForm component
		const locationFormComponent = screen.getByTestId('LocationForm-component')
		expect(locationFormComponent).toBeInTheDocument()

		//Check for CountrySelector component
		const countrySelectorComponent = screen.getByTestId(
			'country-selector',
		) as HTMLSelectElement
		expect(countrySelectorComponent).toBeInTheDocument()
		// Simulate selecting "United States" from the CountrySelector
		await userEvent.selectOptions(countrySelectorComponent, 'United States')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect(countrySelectorComponent.value).toBe('US')

		//Check for StateSelector component
		const stateSelectorComponent = screen.getByTestId(
			'StateSelector-component',
		) as HTMLSelectElement
		expect(stateSelectorComponent).toBeInTheDocument()
		// Simulate selecting "Illinois" from the StateSelector
		await userEvent.selectOptions(stateSelectorComponent, 'Illinois')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect(stateSelectorComponent.value).toBe('ILLINOIS')

		//Check for Rent Amount TextInput component
		const rentInputComponent = screen.getByTestId(
			'create-review-form-rent-1input',
		) as HTMLInputElement
		expect(rentInputComponent).toBeInTheDocument()
		// Simulate typing "2500" into Rent TextInput
		await userEvent.type(rentInputComponent, '2500')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect(rentInputComponent.value).toBe('2500')

		//Check for City ComboBox component
		const cityComboBoxComponent = screen.getByTestId(
			'CityComboBox-component',
		) as HTMLInputElement
		expect(cityComboBoxComponent).toBeInTheDocument()
		// Simulate typing "Chicago" into Rent TextInput
		await userEvent.type(cityComboBoxComponent, 'Chicago')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect(cityComboBoxComponent.value).toBe('Chicago')

		//Check for ZIP/Postal-Code TextInput component
		const zipInputComponent = screen.getByTestId(
			'create-review-form-postal-code-1input',
		) as HTMLInputElement
		expect(zipInputComponent).toBeInTheDocument()
		// Simulate typing "2500" into Rent TextInput
		await userEvent.type(zipInputComponent, '60618')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect(zipInputComponent.value).toBe('60618')

		//Check for Continue button again
		const continueReviewButton2 = screen.getByText('Continue')
		expect(continueReviewButton2).toBeInTheDocument()
		await userEvent.click(continueReviewButton2)

		//Text should still be there
		expect(
			screen.getByText('Help Us Create a Better Living Experience!'),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				'Thank you for reviewing your landlord! Your feedback on maintenance, communication, and overall satisfaction will help tenants in your area make informed housing decisions.',
			),
		).toBeInTheDocument()

		//Check for RatingForm component
		const ratingFormComponent = screen.getByTestId('RatingForm-component')
		expect(ratingFormComponent).toBeInTheDocument()

		//Check for Repair RatingRadio component
		const repairRatingRadioComponent = screen.getByTestId(
			'RepairRatingsRadio-component',
		)
		expect(repairRatingRadioComponent).toBeInTheDocument()
		//Check for each number and click 1
		const repairRatingRadio1Value = screen.getByTestId(
			'RepairRatingsRadio-component1',
		) as HTMLSelectElement
		expect(repairRatingRadio1Value).toBeInTheDocument()
		const repairRatingRadio2Value = screen.getByTestId(
			'RepairRatingsRadio-component2',
		)
		expect(repairRatingRadio2Value).toBeInTheDocument()
		const repairRatingRadio3Value = screen.getByTestId(
			'RepairRatingsRadio-component3',
		)
		expect(repairRatingRadio3Value).toBeInTheDocument()
		const repairRatingRadio4Value = screen.getByTestId(
			'RepairRatingsRadio-component4',
		)
		expect(repairRatingRadio4Value).toBeInTheDocument()
		const repairRatingRadio5Value = screen.getByTestId(
			'RepairRatingsRadio-component5',
		)
		expect(repairRatingRadio5Value).toBeInTheDocument()
		await userEvent.click(repairRatingRadio1Value)

		//Check for Health RatingRadio component
		const healthRatingRadioComponent = screen.getByTestId(
			'HealthRatingsRadio-component',
		)
		expect(healthRatingRadioComponent).toBeInTheDocument()
		//Check for each number and click 2
		const healthRatingRadio1Value = screen.getByTestId(
			'HealthRatingsRadio-component1',
		)
		expect(healthRatingRadio1Value).toBeInTheDocument()
		const healthRatingRadio2Value = screen.getByTestId(
			'HealthRatingsRadio-component2',
		) as HTMLSelectElement
		expect(healthRatingRadio2Value).toBeInTheDocument()
		const healthRatingRadio3Value = screen.getByTestId(
			'HealthRatingsRadio-component3',
		)
		expect(healthRatingRadio3Value).toBeInTheDocument()
		const healthRatingRadio4Value = screen.getByTestId(
			'HealthRatingsRadio-component4',
		)
		expect(healthRatingRadio4Value).toBeInTheDocument()
		const healthRatingRadio5Value = screen.getByTestId(
			'HealthRatingsRadio-component5',
		)
		expect(healthRatingRadio5Value).toBeInTheDocument()
		await userEvent.click(healthRatingRadio2Value)

		//Check for Stability RatingRadio component
		const stabilityRatingRadioComponent = screen.getByTestId(
			'StabilityRatingsRadio-component',
		)
		expect(stabilityRatingRadioComponent).toBeInTheDocument()
		//Check for each number and click 3
		const stabilityRatingRadio1Value = screen.getByTestId(
			'StabilityRatingsRadio-component1',
		)
		expect(stabilityRatingRadio1Value).toBeInTheDocument()
		const stabilityRatingRadio2Value = screen.getByTestId(
			'StabilityRatingsRadio-component2',
		)
		expect(stabilityRatingRadio2Value).toBeInTheDocument()
		const stabilityRatingRadio3Value = screen.getByTestId(
			'StabilityRatingsRadio-component3',
		) as HTMLSelectElement
		expect(stabilityRatingRadio3Value).toBeInTheDocument()
		const stabilityRatingRadio4Value = screen.getByTestId(
			'StabilityRatingsRadio-component4',
		)
		expect(stabilityRatingRadio4Value).toBeInTheDocument()
		const stabilityRatingRadio5Value = screen.getByTestId(
			'StabilityRatingsRadio-component5',
		)
		expect(stabilityRatingRadio5Value).toBeInTheDocument()
		await userEvent.click(stabilityRatingRadio3Value)

		//Check for Privacy RatingRadio component
		const privacyRatingRadioComponent = screen.getByTestId(
			'PrivacyRatingsRadio-component',
		)
		expect(privacyRatingRadioComponent).toBeInTheDocument()
		//Check for each number and click 4
		const privacyRatingRadio1Value = screen.getByTestId(
			'PrivacyRatingsRadio-component1',
		)
		expect(privacyRatingRadio1Value).toBeInTheDocument()
		const privacyRatingRadio2Value = screen.getByTestId(
			'PrivacyRatingsRadio-component2',
		)
		expect(privacyRatingRadio2Value).toBeInTheDocument()
		const privacyRatingRadio3Value = screen.getByTestId(
			'PrivacyRatingsRadio-component3',
		)
		expect(privacyRatingRadio3Value).toBeInTheDocument()
		const privacyRatingRadio4Value = screen.getByTestId(
			'PrivacyRatingsRadio-component4',
		) as HTMLSelectElement
		expect(privacyRatingRadio4Value).toBeInTheDocument()
		const privacyRatingRadio5Value = screen.getByTestId(
			'PrivacyRatingsRadio-component5',
		)
		expect(privacyRatingRadio5Value).toBeInTheDocument()
		await userEvent.click(privacyRatingRadio4Value)

		//Check for Respect RatingRadio component
		const respectRatingRadioComponent = screen.getByTestId(
			'RespectRatingsRadio-component',
		)
		expect(respectRatingRadioComponent).toBeInTheDocument()
		//Check for each number and click 5
		const respectRatingRadio1Value = screen.getByTestId(
			'RespectRatingsRadio-component1',
		)
		expect(respectRatingRadio1Value).toBeInTheDocument()
		const respectRatingRadio2Value = screen.getByTestId(
			'RespectRatingsRadio-component2',
		)
		expect(respectRatingRadio2Value).toBeInTheDocument()
		const respectRatingRadio3Value = screen.getByTestId(
			'RespectRatingsRadio-component3',
		)
		expect(respectRatingRadio3Value).toBeInTheDocument()
		const respectRatingRadio4Value = screen.getByTestId(
			'RespectRatingsRadio-component4',
		)
		expect(respectRatingRadio4Value).toBeInTheDocument()
		const respectRatingRadio5Value = screen.getByTestId(
			'RespectRatingsRadio-component5',
		) as HTMLSelectElement
		expect(respectRatingRadio5Value).toBeInTheDocument()
		await userEvent.click(respectRatingRadio5Value)

		//Check for Continue button again
		const continueReviewButton3 = screen.getByText('Continue')
		expect(continueReviewButton3).toBeInTheDocument()
		await userEvent.click(continueReviewButton3)

		//Check Health and Safety RatingStars value by counting how many stars are colored yellow-400
		const healthRatingStarComponent = screen.getByTestId(
			'Health and SafetyRatingStars-component',
		)
		expect(
			healthRatingStarComponent.querySelectorAll('div > svg.text-yellow-400')
				.length,
		).toBe(2)

		//Check Respect RatingStars value by counting how many stars are colored yellow-400
		const respectRatingStarComponent = screen.getByTestId(
			'RespectRatingStars-component',
		)
		expect(
			respectRatingStarComponent.querySelectorAll('div > svg.text-yellow-400')
				.length,
		).toBe(5)

		//Check Privacy RatingStars value by counting how many stars are colored yellow-400
		const privacyRatingStarComponent = screen.getByTestId(
			'PrivacyRatingStars-component',
		)
		expect(
			privacyRatingStarComponent.querySelectorAll('div > svg.text-yellow-400')
				.length,
		).toBe(4)

		//Check Repair RatingStars value by counting how many stars are colored yellow-400
		const repairRatingStarComponent = screen.getByTestId(
			'RepairRatingStars-component',
		)
		expect(
			repairRatingStarComponent.querySelectorAll('div > svg.text-yellow-400')
				.length,
		).toBe(1)

		//Check Rental Stability RatingStars value by counting how many stars are colored yellow-400
		const stabilityRatingStarComponent = screen.getByTestId(
			'Rental StabilityRatingStars-component',
		)
		expect(
			stabilityRatingStarComponent.querySelectorAll('div > svg.text-yellow-400')
				.length,
		).toBe(3)

		//Text should still be there
		expect(
			screen.getByText('Help Us Create a Better Living Experience!'),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				'Thank you for reviewing your landlord! Your feedback on maintenance, communication, and overall satisfaction will help tenants in your area make informed housing decisions.',
			),
		).toBeInTheDocument()

		//Check for WrittenReviewForm component
		const writtenReviewFormComponent = screen.getByTestId(
			'WrittenReviewForm-component',
		)
		expect(writtenReviewFormComponent).toBeInTheDocument()

		//Written policy should be there
		expect(screen.getByText('Written Review')).toBeInTheDocument()
		expect(
			screen.getByText('Please follow our moderation policy'),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				'Keep reviews civil and avoid including personal information such as addresses or phone numbers.',
			),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				'Avoid sharing personal details about yourself or your landlord that are not relevant to your rental experience.',
			),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				'Inappropriate content may be removed. Thank you for maintaining a safe and helpful community!',
			),
		).toBeInTheDocument()

		const writtenReviewLargeTextInputComponent = screen.getByTestId(
			'create-review-form-text-1',
		) as HTMLInputElement
		expect(writtenReviewLargeTextInputComponent).toBeInTheDocument()
		// Simulate typing written review
		await userEvent.type(
			writtenReviewLargeTextInputComponent,
			'This is a test review written as part of components/create-review/review-form.test.tsx',
		)
		expect(writtenReviewLargeTextInputComponent.value).toBe(
			'This is a test review written as part of components/create-review/review-form.test.tsx',
		)

		//Check for Preview Review button
		const previewReviewButton = screen.getByText('Preview Review')
		expect(previewReviewButton).toBeInTheDocument()
		await userEvent.click(previewReviewButton)

		//Text should still be there
		expect(
			screen.getByText('Help Us Create a Better Living Experience!'),
		).toBeInTheDocument()
		expect(
			screen.getByText(
				'Thank you for reviewing your landlord! Your feedback on maintenance, communication, and overall satisfaction will help tenants in your area make informed housing decisions.',
			),
		).toBeInTheDocument()

		//Check for ReviewPreview component
		const reviewPreviewComponent = screen.getByTestId('ReviewPreview-component')
		expect(reviewPreviewComponent).toBeInTheDocument()

		//Check for landlord's name in preview
		const landlordPreviewComponent = screen.getByTestId(
			'ReviewPreview-Landlord',
		)
		expect(landlordPreviewComponent).toHaveTextContent('John Doe')

		//Check for summarized rating in preview
		const ratingPreviewComponent = screen.getByTestId(
			'ReviewPreview-Rating',
		) as HTMLInputElement
		expect(
			ratingPreviewComponent.querySelectorAll('div > svg.text-yellow-400')
				.length,
		).toBe(3)

		//Check for location in preview
		const locationPreviewComponent = screen.getByTestId(
			'ReviewPreview-Location',
		) as HTMLInputElement
		expect(locationPreviewComponent).toHaveTextContent(
			'Chicago, ILLINOIS, US, 60618',
		)

		//Check for Health and Safety rating in preview
		const healthRatingPreviewComponent = screen.getByTestId(
			'HealthReviewPreviewRating',
		) as HTMLInputElement
		expect(
			healthRatingPreviewComponent.querySelectorAll('div > svg.text-yellow-400')
				.length,
		).toBe(2)

		//Check for Respect rating in preview
		const respectRatingPreviewComponent = screen.getByTestId(
			'RespectReviewPreviewRating',
		) as HTMLInputElement
		expect(
			respectRatingPreviewComponent.querySelectorAll(
				'div > svg.text-yellow-400',
			).length,
		).toBe(5)

		//Check for Tenant Privacy rating in preview
		const privacyRatingPreviewComponent = screen.getByTestId(
			'PrivacyReviewPreviewRating',
		) as HTMLInputElement
		expect(
			privacyRatingPreviewComponent.querySelectorAll(
				'div > svg.text-yellow-400',
			).length,
		).toBe(4)

		//Check for Repair rating in preview
		const repairRatingPreviewComponent = screen.getByTestId(
			'RepairReviewPreviewRating',
		) as HTMLInputElement
		expect(
			repairRatingPreviewComponent.querySelectorAll('div > svg.text-yellow-400')
				.length,
		).toBe(1)

		//Check for Rental Stability rating in preview
		const stabilityRatingPreviewComponent = screen.getByTestId(
			'StabilityReviewPreviewRating',
		) as HTMLInputElement
		expect(
			stabilityRatingPreviewComponent.querySelectorAll(
				'div > svg.text-yellow-400',
			).length,
		).toBe(3)

		//Check for Rent in preview
		const rentPreviewComponent = screen.getByTestId(
			'ReviewPreviewRent',
		) as HTMLInputElement
		expect(rentPreviewComponent).toHaveTextContent('Rent Amount: $2500')

		//Check for Written Review in preview
		const writtenReviewPreviewComponent = screen.getByTestId(
			'WrittenReviewPreview',
		) as HTMLInputElement
		expect(writtenReviewPreviewComponent).toHaveTextContent(
			'This is a test review written as part of components/create-review/review-form.test.tsx',
		)

		//Check for Disclaimer 1 and check
		const disclaimer1Input = screen.getByTestId(
			'terms-1-input',
		) as HTMLInputElement
		expect(disclaimer1Input).toBeInTheDocument()
		await userEvent.click(disclaimer1Input)

		//Check for Disclaimer 2 and check
		const disclaimer2Input = screen.getByTestId(
			'terms-2-input',
		) as HTMLInputElement
		expect(disclaimer2Input).toBeInTheDocument()
		await userEvent.click(disclaimer2Input)

		//Check for Disclaimer 3 and check
		const disclaimer3Input = screen.getByTestId(
			'terms-3-input',
		) as HTMLInputElement
		expect(disclaimer3Input).toBeInTheDocument()
		await userEvent.click(disclaimer3Input)

		//Check for Submit Review button
		const submitReviewButton = screen.getByText('Submit Review')
		expect(submitReviewButton).toBeInTheDocument()
		await userEvent.click(submitReviewButton)

		const successModalComponent = screen.getByTestId('SuccessModalComponent')
		expect(successModalComponent).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<ReviewForm />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
