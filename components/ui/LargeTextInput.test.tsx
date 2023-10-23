/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import LargeTextInput from './LargeTextInput'

describe('LargeTextInput Component', () => {
	const mockProps = {
		title: 'Input Title',
		id: 'inputId',
		value: 'Sample Value',
		setValue: jest.fn(),
		rows: 4,
		placeHolder: 'Placeholder',
		testid: 'inputTestId',
		length: 10,
		limitText: 'Character Limit Exceeded',
	}

	test('renders LargeTextInput component with default values', () => {
		render(
			<LargeTextInput
				title={mockProps.title}
				id={mockProps.id}
				value={mockProps.value}
				setValue={mockProps.setValue}
				rows={mockProps.rows}
				placeHolder={mockProps.placeHolder}
				testid={mockProps.testid}
				length={mockProps.length}
				limitText={mockProps.limitText}
			/>,
		)

		// Ensure that the component is rendered with the provided title, value, and id
		expect(screen.getByText(mockProps.title)).toBeInTheDocument()
		expect(screen.getByDisplayValue(mockProps.placeHolder)).toBeInTheDocument()
		expect(screen.getByTestId(mockProps.testid)).toBeInTheDocument()
	})

	test('displays limit text and applies error styling when length limit is exceeded', () => {
		render(
			<LargeTextInput
				id={mockProps.id}
				title={mockProps.title}
				value='Sample Value Exceeding Limit'
				setValue={mockProps.setValue}
				rows={mockProps.rows}
				placeHolder={mockProps.placeHolder}
				testid={mockProps.testid}
				length={mockProps.length}
				limitText={mockProps.limitText}
			/>,
		)

		// Ensure that the limit text is displayed
		expect(screen.getByText(mockProps.limitText)).toBeInTheDocument()

		// Ensure that the component has error styling
		const textareaElement = screen.getByTestId('error-text')
		expect(textareaElement).toHaveClass('text-red-400')
	})
})
