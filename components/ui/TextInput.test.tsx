/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextInput from './TextInput';

describe('TextInput Component', () => {
  const mockProps = {
    title: 'Input Title',
    value: 'Sample Value',
    setValue: jest.fn(),
    placeHolder: 'Placeholder',
    id: 'inputId',
    error: false,
    errorText: 'Error Message',
    testid: 'inputTestId',
  };

  test('renders TextInput component with default values', () => {
    render(
      <TextInput
        title={mockProps.title}
        value={mockProps.value}
        setValue={mockProps.setValue}
        id={mockProps.id}
        placeHolder={mockProps.placeHolder}
      />
    );

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(mockProps.placeHolder)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProps.value)).toBeInTheDocument();
  });

  test('calls setValue function when input changes', () => {
    render(
      <TextInput
        title={mockProps.title}
        value={mockProps.value}
        setValue={mockProps.setValue}
        id={mockProps.id}
        placeHolder={mockProps.placeHolder}
      />
    );

    const inputElement = screen.getByPlaceholderText(mockProps.placeHolder);

    fireEvent.change(inputElement, { target: { value: 'New Value' } });

    expect(mockProps.setValue).toHaveBeenCalledWith('New Value');
  });

  test('displays error message and error styling when error is true', () => {
    const propsWithError = {
      title: mockProps.title,
      value: mockProps.value,
      setValue: mockProps.setValue,
      id: mockProps.id,
      placeHolder: mockProps.placeHolder,
      error: true,
      errorText: mockProps.errorText,
      testid: mockProps.testid,
    };

    render(<TextInput {...propsWithError} />);

    expect(screen.getByText(propsWithError.errorText)).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText(propsWithError.placeHolder);
    expect(inputElement).toHaveClass('border-red-400');
  });
});
