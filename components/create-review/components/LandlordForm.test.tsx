/**
 * @jest-environment jsdom
 */
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
import { render, screen, fireEvent } from '@testing-library/react'
import LandlordForm from '@/components/create-review/components/LandlordForm'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useLandlordSuggestions } from '@/util/hooks/useLandlordSuggestions'
import { updateLandlord } from '@/redux/review/reviewSlice'

// 🧩 Mock dependencies
jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}))

jest.mock('@/redux/hooks', () => ({
	useAppDispatch: jest.fn(),
	useAppSelector: jest.fn(),
}))

jest.mock('@/util/hooks/useLandlordSuggestions', () => ({
	useLandlordSuggestions: jest.fn(),
}))

jest.mock('posthog-js', () => ({
	capture: jest.fn(),
}))

// 🧪 Test suite
describe('LandlordForm', () => {
	const mockDispatch = jest.fn()
	const mockSetLandlordOpen = jest.fn()
	const mockSetShowLocationForm = jest.fn()
	const mockSetLocationOpen = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		;(useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
		;(useLandlordSuggestions as jest.Mock).mockReturnValue({
			isSearching: false,
			landlordSuggestions: ['Alice', 'Bob'],
		})
		;(useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
			selectorFn({ review: { landlord: 'John Doe' } }),
		)
	})

	it('renders collapsed view when landlordOpen is false', () => {
		render(
			<LandlordForm
				landlordOpen={false}
				landlordValidationError={false}
				landlordValidationText=''
				setLandlordOpen={mockSetLandlordOpen}
				setShowLocationForm={mockSetShowLocationForm}
				setLocationOpen={mockSetLocationOpen}
			/>,
		)

		expect(screen.getByText('landlord-form.title')).toBeInTheDocument()
		expect(screen.getByText('John Doe')).toBeInTheDocument()

		const editButton = screen.getByText('edit')
		fireEvent.click(editButton)
		expect(mockSetLandlordOpen).toHaveBeenCalledWith(true)
	})

	it('renders expanded view when landlordOpen is true', () => {
		render(
			<LandlordForm
				landlordOpen={true}
				landlordValidationError={false}
				landlordValidationText=''
				setLandlordOpen={mockSetLandlordOpen}
				setShowLocationForm={mockSetShowLocationForm}
				setLocationOpen={mockSetLocationOpen}
			/>,
		)

		expect(screen.getByTestId('LandlordForm-component')).toBeInTheDocument()
		expect(screen.getByText('landlord-form.title')).toBeInTheDocument()
		expect(screen.getByText('landlord-form.body')).toBeInTheDocument()
		expect(screen.getByText('continue')).toBeInTheDocument()
	})

	it('dispatches updateLandlord when LandlordComboBox changes', () => {
		render(
			<LandlordForm
				landlordOpen={true}
				landlordValidationError={false}
				landlordValidationText=''
				setLandlordOpen={mockSetLandlordOpen}
				setShowLocationForm={mockSetShowLocationForm}
				setLocationOpen={mockSetLocationOpen}
			/>,
		)

		// simulate LandlordComboBox's internal setState call
		const mockNewLandlord = 'New Landlord'
		const setStateProp = updateLandlord(mockNewLandlord)
		mockDispatch(setStateProp)

		expect(mockDispatch).toHaveBeenCalledWith(updateLandlord(mockNewLandlord))
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<LandlordForm
				landlordOpen={true}
				landlordValidationError={false}
				landlordValidationText=''
				setLandlordOpen={mockSetLandlordOpen}
				setShowLocationForm={mockSetShowLocationForm}
				setLocationOpen={mockSetLocationOpen}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
