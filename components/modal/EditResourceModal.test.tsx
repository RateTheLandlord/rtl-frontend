/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import EditResourceModal from './EditResourceModal'

describe('EditResourceModal Component', () => {
	const mockSelectedResource = {
		id: 1,
		name: 'Sample Place',
		country_code: 'US',
		city: 'New York',
		state: 'NY',
		address: '123 Main St',
		phone_number: '(123) 456-7890',
		description: 'A sample place description.',
		href: 'https://example.com/sample-place',
		date_added: new Date(),
	}

	const mockProps = {
		selectedResource: mockSelectedResource,
		mutateString: 'sampleMutateString',
		setEditResourceOpen: jest.fn(),
		setSuccess: jest.fn(),
		setRemoveAlertOpen: jest.fn(),
		editResourceOpen: true,
		setSelectedResource: jest.fn(),
	}

	test('renders EditResourceModal component', () => {
		render(
			<EditResourceModal
				selectedResource={mockProps.selectedResource}
				mutateString={mockProps.mutateString}
				setEditResourceOpen={mockProps.setEditResourceOpen}
				setSuccess={mockProps.setSuccess}
				setRemoveAlertOpen={mockProps.setRemoveAlertOpen}
				editResourceOpen={mockProps.editResourceOpen}
				setSelectedResource={mockProps.setSelectedResource}
			/>,
		)
		// Ensure that the modal is rendered
		expect(screen.getByText('Name')).toBeInTheDocument()
		expect(screen.getByText('Address')).toBeInTheDocument()
	})
})
