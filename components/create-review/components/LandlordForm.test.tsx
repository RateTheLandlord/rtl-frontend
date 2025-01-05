/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import LandlordForm from './LandlordForm'
import { useLandlordSuggestions } from '@/util/hooks/useLandlordSuggestions'

jest.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}))

jest.mock('@/util/hooks/useLandlordSuggestions', () => ({
	useLandlordSuggestions: jest.fn(),
}))

jest.mock('./LandlordComboBox', () =>
	jest.fn(() => <div>LandlordComboBox</div>),
)
jest.mock('@/components/ui/button', () =>
	jest.fn(({ children, ...props }) => <button {...props}>{children}</button>),
)

describe('LandlordForm Component', () => {
	const mockSetLandlordOpen = jest.fn()
	const mockSetLandlordName = jest.fn()
	const mockSetShowLocationForm = jest.fn()
	const mockSetLocationOpen = jest.fn()

	const defaultProps = {
		landlordOpen: false,
		setLandlordOpen: mockSetLandlordOpen,
		landlord: 'John Doe',
		setLandlordName: mockSetLandlordName,
		setShowLocationForm: mockSetShowLocationForm,
		setLocationOpen: mockSetLocationOpen,
		landlordValidationError: false,
		landlordValidationText: '',
	}

	beforeEach(() => {
		jest.clearAllMocks()
		;(useLandlordSuggestions as jest.Mock).mockReturnValue({
			isSearching: false,
			landlordSuggestions: ['John Doe LLC', 'Doe Management'],
		})
	})

	it('should render landlord info and Edit button when landlordOpen is false', () => {
		render(<LandlordForm {...defaultProps} />)

		expect(
			screen.getByText('create-review.landlord-form.title'),
		).toBeInTheDocument()
		expect(screen.getByText('John Doe')).toBeInTheDocument()
		expect(screen.getByText('create-review.edit')).toBeInTheDocument()
	})

	it('should call setLandlordOpen(true) when Edit button is clicked', () => {
		render(<LandlordForm {...defaultProps} />)

		fireEvent.click(screen.getByText('create-review.edit'))

		expect(mockSetLandlordOpen).toHaveBeenCalledWith(true)
	})

	it('should render the LandlordComboBox when landlordOpen is true', () => {
		render(<LandlordForm {...defaultProps} landlordOpen={true} />)

		expect(screen.getByText('LandlordComboBox')).toBeInTheDocument()
	})

	it('should call setShowLocationForm, setLocationOpen and setLandlordOpen(false) when Continue button is clicked', () => {
		render(
			<LandlordForm
				{...defaultProps}
				landlordOpen={true}
				landlord='John Doe'
			/>,
		)

		fireEvent.click(screen.getByText('create-review.continue'))

		expect(mockSetShowLocationForm).toHaveBeenCalledWith(true)
		expect(mockSetLocationOpen).toHaveBeenCalledWith(true)
		expect(mockSetLandlordOpen).toHaveBeenCalledWith(false)
	})

	it('should disable Continue button if landlord is empty', () => {
		render(<LandlordForm {...defaultProps} landlordOpen={true} landlord='' />)

		const continueButton = screen.getByText('create-review.continue')
		expect(continueButton).toBeDisabled()
	})
})
