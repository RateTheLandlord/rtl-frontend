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

interface LandlordComboBoxProps {
	setState: (landlord: string) => void
	suggestions: string[]
	isSearching: boolean
	error: boolean
	errorText: string
}

jest.mock('./LandlordComboBox', () => ({
	__esModule: true,
	default: ({
		setState,
		suggestions,
		isSearching,
		error,
		errorText,
	}: LandlordComboBoxProps) => (
		<div data-testid='LandlordComboBox'>
			<button type='button' onClick={() => setState('New Landlord')}>
				Change Landlord
			</button>
			<div>{suggestions.join(', ')}</div>
			<div>{isSearching ? 'Searching' : 'Idle'}</div>
			<div>{error ? errorText : 'No error'}</div>
		</div>
	),
}))

jest.mock('posthog-js', () => ({
	capture: jest.fn(),
}))

// 🧪 Test suite
describe('LandlordForm', () => {
	const mockDispatch = jest.fn()

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

	it('renders the landlord form fields', () => {
		render(
			<LandlordForm
				landlordValidationError={false}
				landlordValidationText=''
			/>,
		)

		expect(screen.getByTestId('LandlordForm-component')).toBeInTheDocument()
		expect(screen.getByText('landlord-form.title')).toBeInTheDocument()
		expect(screen.getByText('landlord-form.body')).toBeInTheDocument()
		expect(screen.getByTestId('LandlordComboBox')).toBeInTheDocument()
	})

	it('dispatches updateLandlord when the combobox setState is triggered', () => {
		render(
			<LandlordForm
				landlordValidationError={false}
				landlordValidationText=''
			/>,
		)

		fireEvent.click(screen.getByText('Change Landlord'))
		expect(mockDispatch).toHaveBeenCalledWith(updateLandlord('New Landlord'))
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<LandlordForm
				landlordValidationError={false}
				landlordValidationText=''
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
