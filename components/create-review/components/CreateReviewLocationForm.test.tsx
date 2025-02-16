/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@/test-utils'
import LocationForm from './CreateReviewLocationForm'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('react-i18next', () => ({
	useTranslations: () => ({ t: (key: string) => key }),
}))

jest.mock('@/components/ui/button', () =>
	jest.fn(({ children, ...props }) => <button {...props}>{children}</button>),
)
jest.mock('@/components/ui/StateSelector', () =>
	jest.fn(() => <div>StateSelector</div>),
)
jest.mock('@/components/ui/TextInput', () =>
	jest.fn(() => <input aria-label='TEST INPUT' data-testid='TextInput' />),
)
jest.mock('@/components/ui/CountrySelector', () =>
	jest.fn(() => <div>CountrySelector</div>),
)
jest.mock('./CityComboBox', () => jest.fn(() => <div>CityComboBox</div>))

describe('LocationForm Component', () => {
	const mockSetLocationOpen = jest.fn()
	const mockSetCountry = jest.fn()
	const mockSetCityName = jest.fn()
	const mockSetProvince = jest.fn()
	const mockHandleTextChange = jest.fn()
	const mockSetShowRatingForm = jest.fn()
	const mockSetRatingsOpen = jest.fn()

	const defaultProps = {
		locationOpen: false,
		city: 'Toronto',
		province: 'Ontario',
		country: 'Canada',
		isIreland: false,
		postal: 'M5V 2T6',
		rent: 1200,
		postalError: false,
		locations: [],
		searching: false,
		cityValidationError: false,
		cityValidationErrorText: '',
		setProvince: mockSetProvince,
		handleTextChange: mockHandleTextChange,
		setShowRatingForm: mockSetShowRatingForm,
		setRatingsOpen: mockSetRatingsOpen,
		setLocationOpen: mockSetLocationOpen,
		setCountry: mockSetCountry,
		setCityName: mockSetCityName,
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should render location info and Edit button when locationOpen is false', () => {
		render(<LocationForm {...defaultProps} />)

		expect(
			screen.getByText('createreview.location-form.title'),
		).toBeInTheDocument()
		expect(
			screen.getByText('Toronto, Ontario, Canada, M5V 2T6 - $1200'),
		).toBeInTheDocument()
		expect(screen.getByText('createreview.edit')).toBeInTheDocument()
	})

	it('should call setLocationOpen(true) when Edit button is clicked', () => {
		render(<LocationForm {...defaultProps} />)

		fireEvent.click(screen.getByText('createreview.edit'))

		expect(mockSetLocationOpen).toHaveBeenCalledWith(true)
	})

	it('should render form elements when locationOpen is true', () => {
		render(<LocationForm {...defaultProps} locationOpen={true} />)

		expect(screen.getByText('CountrySelector')).toBeInTheDocument()
		expect(screen.getByText('CityComboBox')).toBeInTheDocument()
		expect(screen.getByText('StateSelector')).toBeInTheDocument()
		expect(screen.getAllByTestId('TextInput')).toHaveLength(2)
	})

	it('should call setShowRatingForm, setLocationOpen, and setRatingsOpen when Continue button is clicked', () => {
		render(<LocationForm {...defaultProps} locationOpen={true} />)

		fireEvent.click(screen.getByText('createreview.continue'))

		expect(mockSetShowRatingForm).toHaveBeenCalledWith(true)
		expect(mockSetLocationOpen).toHaveBeenCalledWith(false)
		expect(mockSetRatingsOpen).toHaveBeenCalledWith(true)
	})

	it('should disable Continue button when city is empty and not in Ireland', () => {
		render(<LocationForm {...defaultProps} locationOpen={true} city='' />)

		const continueButton = screen.getByText('createreview.continue')
		expect(continueButton).toBeDisabled()
	})

	it('should disable Continue button when postal is empty and not in Ireland', () => {
		render(<LocationForm {...defaultProps} locationOpen={true} postal='' />)

		const continueButton = screen.getByText('createreview.continue')
		expect(continueButton).toBeDisabled()
	})

	it('should not disable Continue button when in Ireland and city is filled', () => {
		render(
			<LocationForm
				{...defaultProps}
				locationOpen={true}
				isIreland={true}
				postal=''
				city='Dublin'
			/>,
		)

		const continueButton = screen.getByText('createreview.continue')
		expect(continueButton).not.toBeDisabled()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<LocationForm
				{...defaultProps}
				locationOpen={true}
				isIreland={true}
				postal=''
				city='Dublin'
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
