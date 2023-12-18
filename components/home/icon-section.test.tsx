/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect' // for expect(...).toBeInTheDocument()
import IconSection from './icon-section' // Adjust the path based on your file structure

test('IconSection renders correctly', () => {
	render(<IconSection />)

	// Ensure the component renders
	const section = screen.getByTestId('home-icon-section-1')
	expect(section).toBeInTheDocument()
})
