/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
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
		expect(screen.getByText('createreview.hero.title')).toBeInTheDocument()
		expect(screen.getByText('createreview.hero.body')).toBeInTheDocument()

		//Check for Start a Review button
		const startReviewButton = screen.getByTestId('submit-button-1')
		expect(startReviewButton).toBeInTheDocument()
		await userEvent.click(startReviewButton)

		//Text should still be there
		expect(screen.getByText('createreview.hero.title')).toBeInTheDocument()
		expect(screen.getByText('createreview.hero.body')).toBeInTheDocument()

		//Check for LandlordForm component
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

		//Check for Continue button
		const continueReviewButton = screen.getByText('createreview.continue')
		expect(continueReviewButton).toBeInTheDocument()
		await userEvent.click(continueReviewButton)

		//Text should still be there
		expect(screen.getByText('createreview.hero.title')).toBeInTheDocument()
		expect(screen.getByText('createreview.hero.body')).toBeInTheDocument()

		//Check for LandlordForm component
		const locationFormComponent = screen.getByTestId('LocationForm-component')
		expect(locationFormComponent).toBeInTheDocument()

		//Check for CountrySelector component
		const countrySelectorComponent = screen.getByTestId('country-selector')
		expect(countrySelectorComponent).toBeInTheDocument()
		// Simulate selecting "United States" from the CountrySelector
		await userEvent.selectOptions(countrySelectorComponent, 'United States')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect((countrySelectorComponent as HTMLSelectElement).value).toBe('US')

		//Check for StateSelector component
		const stateSelectorComponent = screen.getByTestId('StateSelector-component')
		expect(stateSelectorComponent).toBeInTheDocument()
		// Simulate selecting "Illinois" from the StateSelector
		await userEvent.selectOptions(stateSelectorComponent, 'Illinois')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect((stateSelectorComponent as HTMLSelectElement).value).toBe('ILLINOIS')

		//Check for Rent Amount TextInput component
		const rentInputComponent = screen.getByTestId(
			'create-review-form-rent-1input',
		)
		expect(rentInputComponent).toBeInTheDocument()
		// Simulate typing "2500" into Rent TextInput
		await userEvent.type(rentInputComponent, '2500')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect((rentInputComponent as HTMLInputElement).value).toBe('2500')

		//Check for City ComboBox component
		const cityComboBoxComponent = screen.getByTestId('CityComboBox-component')
		expect(cityComboBoxComponent).toBeInTheDocument()
		// Simulate typing "Chicago" into Rent TextInput
		await userEvent.type(cityComboBoxComponent, 'Chicago')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect((cityComboBoxComponent as HTMLInputElement).value).toBe('Chicago')

		//Check for ZIP/Postal-Code TextInput component
		const zipInputComponent = screen.getByTestId(
			'create-review-form-postal-code-1input',
		)
		expect(zipInputComponent).toBeInTheDocument()
		// Simulate typing "2500" into Rent TextInput
		await userEvent.type(zipInputComponent, '60618')
		//Check that simulated typed value is reflected in LandlordComboBox
		expect((zipInputComponent as HTMLInputElement).value).toBe('60618')

		//Check for Continue button again
		const continueReviewButton2 = screen.getByText('createreview.continue')
		expect(continueReviewButton2).toBeInTheDocument()
		await userEvent.click(continueReviewButton2)

		//Text should still be there
		expect(screen.getByText('createreview.hero.title')).toBeInTheDocument()
		expect(screen.getByText('createreview.hero.body')).toBeInTheDocument()

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
		)
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
		)
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
		)
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
		)
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
		)
		expect(respectRatingRadio5Value).toBeInTheDocument()
		await userEvent.click(respectRatingRadio5Value)

		//Check for Continue button again
		const continueReviewButton3 = screen.getByText('createreview.continue')
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
		expect(screen.getByText('createreview.hero.title')).toBeInTheDocument()
		expect(screen.getByText('createreview.hero.body')).toBeInTheDocument()

		//Check for WrittenReviewForm component
		const writtenReviewFormComponent = screen.getByTestId(
			'WrittenReviewForm-component',
		)
		expect(writtenReviewFormComponent).toBeInTheDocument()

		//Written policy should be there
		expect(
			screen.getByText('createreview.written-review.title'),
		).toBeInTheDocument()
		expect(
			screen.getByText('createreview.written-review.policy-1'),
		).toBeInTheDocument()
		expect(
			screen.getByText('createreview.written-review.policy-2'),
		).toBeInTheDocument()
		expect(
			screen.getByText('createreview.written-review.policy-3'),
		).toBeInTheDocument()
		expect(
			screen.getByText('createreview.written-review.policy-4'),
		).toBeInTheDocument()

		const writtenReviewLargeTextInputComponent = screen.getByTestId(
			'create-review-form-text-1',
		)
		expect(writtenReviewLargeTextInputComponent).toBeInTheDocument()
		// Simulate typing written review
		await userEvent.type(
			writtenReviewLargeTextInputComponent,
			'This is a test review written as part of components/create-review/review-form.test.tsx',
		)
		expect(
			(writtenReviewLargeTextInputComponent as HTMLTextAreaElement).value,
		).toBe(
			'This is a test review written as part of components/create-review/review-form.test.tsx',
		)

		//Check for Preview Review button
		const previewReviewButton = screen.getByText(
			'createreview.written-review.preview-review',
		)
		expect(previewReviewButton).toBeInTheDocument()
		await userEvent.click(previewReviewButton)

		//Text should still be there
		expect(screen.getByText('createreview.hero.title')).toBeInTheDocument()
		expect(screen.getByText('createreview.hero.body')).toBeInTheDocument()

		//Check for ReviewPreview component
		const reviewPreviewComponent = screen.getByTestId('ReviewPreview-component')
		expect(reviewPreviewComponent).toBeInTheDocument()

		//Check for landlord's name in preview
		const landlordPreviewComponent = screen.getByTestId(
			'ReviewPreview-Landlord',
		)
		expect(landlordPreviewComponent).toHaveTextContent('John Doe')

		//Check for summarized rating in preview
		const ratingPreviewComponent = screen.getByTestId('ReviewPreview-Rating')
		expect(
			ratingPreviewComponent.querySelectorAll('div > svg.text-yellow-400')
				.length,
		).toBe(3)

		//Check for location in preview
		const locationPreviewComponent = screen.getByTestId(
			'ReviewPreview-Location',
		)
		expect(locationPreviewComponent).toHaveTextContent(
			'Chicago, ILLINOIS, US, 60618',
		)

		//Check for Health and Safety rating in preview
		const healthRatingPreviewComponent = screen.getByTestId(
			'HealthReviewPreviewRating',
		)
		expect(
			healthRatingPreviewComponent.querySelectorAll('div > svg.text-yellow-400')
				.length,
		).toBe(2)

		//Check for Respect rating in preview
		const respectRatingPreviewComponent = screen.getByTestId(
			'RespectReviewPreviewRating',
		)
		expect(
			respectRatingPreviewComponent.querySelectorAll(
				'div > svg.text-yellow-400',
			).length,
		).toBe(5)

		//Check for Tenant Privacy rating in preview
		const privacyRatingPreviewComponent = screen.getByTestId(
			'PrivacyReviewPreviewRating',
		)
		expect(
			privacyRatingPreviewComponent.querySelectorAll(
				'div > svg.text-yellow-400',
			).length,
		).toBe(4)

		//Check for Repair rating in preview
		const repairRatingPreviewComponent = screen.getByTestId(
			'RepairReviewPreviewRating',
		)
		expect(
			repairRatingPreviewComponent.querySelectorAll('div > svg.text-yellow-400')
				.length,
		).toBe(1)

		//Check for Rental Stability rating in preview
		const stabilityRatingPreviewComponent = screen.getByTestId(
			'StabilityReviewPreviewRating',
		)
		expect(
			stabilityRatingPreviewComponent.querySelectorAll(
				'div > svg.text-yellow-400',
			).length,
		).toBe(3)

		//Check for Rent in preview
		// const rentPreviewComponent = screen.getByTestId('ReviewPreviewRent')
		// expect(rentPreviewComponent).toHaveTextContent('Rent Amount: $2500')

		//Check for Written Review in preview
		const writtenReviewPreviewComponent = screen.getByTestId(
			'WrittenReviewPreview',
		)
		expect(writtenReviewPreviewComponent).toHaveTextContent(
			'This is a test review written as part of components/create-review/review-form.test.tsx',
		)

		//Check for Disclaimer 1 and check
		const disclaimer1Input = screen.getByTestId('terms-1-input')
		expect(disclaimer1Input).toBeInTheDocument()
		await userEvent.click(disclaimer1Input)

		//Check for Disclaimer 2 and check
		const disclaimer2Input = screen.getByTestId('terms-2-input')
		expect(disclaimer2Input).toBeInTheDocument()
		await userEvent.click(disclaimer2Input)

		//Check for Disclaimer 3 and check
		const disclaimer3Input = screen.getByTestId('terms-3-input')
		expect(disclaimer3Input).toBeInTheDocument()
		await userEvent.click(disclaimer3Input)

		//Check for Submit Review button
		const submitReviewButton = screen.getByText(
			'createreview.review-form.submit',
		)
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
