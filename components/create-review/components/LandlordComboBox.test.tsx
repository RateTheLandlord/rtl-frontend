/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test-utils'
import LandlordComboBox from './LandlordComboBox'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

interface RenderComponentProps {
	state: string | undefined
	setState: (state: string) => void
	suggestions: string[]
	isSearching: boolean
	error: boolean
	errorText: string
}

describe('LandlordComboBox', () => {
	const suggestions = ['Daniel White', 'David Johnson', 'Michael Davis']

	const handleChange = jest.fn()

	const renderComponent = ({
		state,
		setState,
		suggestions,
		isSearching,
		error,
		errorText,
	}: RenderComponentProps) => {
		return render(
			<LandlordComboBox
				name='Landlord Name (or Property Management Company) - No Addresses'
				state={state}
				setState={setState}
				suggestions={suggestions}
				isSearching={isSearching}
				error={error}
				errorText={errorText}
			/>,
		)
	}

	test('renders component with label and placeholder', () => {
		renderComponent({
			state: '',
			setState: handleChange,
			suggestions: suggestions,
			isSearching: false,
			error: false,
			errorText: '',
		})

		const inputElement = screen.getByPlaceholderText(
			'Landlord Name (or Property Management Company) - No Addresses',
		)

		expect(inputElement).toBeInTheDocument()
		expect(inputElement).toHaveAttribute(
			'placeholder',
			'Landlord Name (or Property Management Company) - No Addresses',
		)
	})

	test('shows dropdown options when name matches and selects the first option on Enter', async () => {
		renderComponent({
			state: '',
			setState: handleChange,
			suggestions: suggestions,
			isSearching: false,
			error: false,
			errorText: '',
		})

		const inputElement = screen.getByPlaceholderText(
			'Landlord Name (or Property Management Company) - No Addresses',
		)
		fireEvent.change(inputElement, { target: { value: 'Da' } })

		await waitFor(() => {
			expect(screen.getByText('Daniel White')).toBeInTheDocument()
			expect(screen.getByText('David Johnson')).toBeInTheDocument()
			expect(screen.getByText('Michael Davis')).toBeInTheDocument()
		})

		fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' })
		expect(handleChange).toHaveBeenCalledWith('Daniel White')
	})

	test('highlights the selected name in dropdown on ArrowDown', async () => {
		renderComponent({
			state: '',
			setState: handleChange,
			suggestions: suggestions,
			isSearching: false,
			error: false,
			errorText: '',
		})

		const inputElement = screen.getByPlaceholderText(
			'Landlord Name (or Property Management Company) - No Addresses',
		)
		fireEvent.change(inputElement, { target: { value: 'Da' } })

		const option = await waitFor(() => screen.getByText('Daniel White'))
		expect(option).toBeInTheDocument()

		fireEvent.keyDown(option, { key: 'ArrowDown', code: 'ArrowDown' })

		await waitFor(() => {
			expect(option).toHaveClass('bg-teal-200')
		})
	})

	test("shows 'Loading...' message when searching prop is true", async () => {
		render(
			<LandlordComboBox
				name='Landlord Name (or Property Management Company) - No Addresses'
				state='some state'
				setState={handleChange}
				suggestions={[]}
				isSearching={true}
				error={false}
				errorText=''
			/>,
		)

		const inputElement = screen.getByPlaceholderText(
			'Landlord Name (or Property Management Company) - No Addresses',
		)
		fireEvent.change(inputElement, { target: { value: 'O' } })

		await waitFor(() => {
			expect(screen.getByText('Loading...')).toBeInTheDocument()
		})
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<LandlordComboBox
				name='Landlord Name (or Property Management Company) - No Addresses'
				state='some state'
				setState={handleChange}
				suggestions={[]}
				isSearching={true}
				error={false}
				errorText=''
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
