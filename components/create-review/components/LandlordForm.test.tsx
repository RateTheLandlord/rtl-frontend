/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@/test-utils'
import LandlordForm from './LandlordForm'
import { useLandlordSuggestions } from '@/util/hooks/useLandlordSuggestions'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

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
			screen.getByText('createreview.landlord-form.title'),
		).toBeInTheDocument()
		expect(screen.getByText('John Doe')).toBeInTheDocument()
		expect(screen.getByText('createreview.edit')).toBeInTheDocument()
	})

	it('should call setLandlordOpen(true) when Edit button is clicked', () => {
		render(<LandlordForm {...defaultProps} />)

		fireEvent.click(screen.getByText('createreview.edit'))

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

		fireEvent.click(screen.getByText('createreview.continue'))

		expect(mockSetShowLocationForm).toHaveBeenCalledWith(true)
		expect(mockSetLocationOpen).toHaveBeenCalledWith(true)
		expect(mockSetLandlordOpen).toHaveBeenCalledWith(false)
	})

	it('should disable Continue button if landlord is empty', () => {
		render(<LandlordForm {...defaultProps} landlordOpen={true} landlord='' />)

		const continueButton = screen.getByText('createreview.continue')
		expect(continueButton).toBeDisabled()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<LandlordForm {...defaultProps} landlordOpen={true} landlord='' />,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
