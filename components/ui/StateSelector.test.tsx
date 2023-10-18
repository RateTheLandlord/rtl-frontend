/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StateSelector from './StateSelector';

describe('StateSelector Component', () => {
  const mockProps = {
    country: 'CA', // Replace with your desired country code
    setValue: jest.fn(),
  };

  test('renders StateSelector component for Canada', () => {
    render(<StateSelector country={mockProps.country} setValue={mockProps.setValue} />);
    const selectElement = screen.getByTestId('state-selector');

    // Ensure that the select element is rendered
    expect(selectElement).toBeInTheDocument();
  });
});
