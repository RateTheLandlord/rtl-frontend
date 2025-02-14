/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CustomMarker from './CustomMarker'
import { IZipLocations } from '@/lib/location/location'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('CustomMarker', () => {
	const mockLocation: IZipLocations = {
		zip: '12345',
		latitude: '0',
		longitude: '0',
	}
	const mockSetSelectedPoint = jest.fn()

	it('renders correctly, with no selected point', () => {
		const { container } = render(
			<CustomMarker
				location={mockLocation}
				selectedPoint={null}
				setSelectedPoint={mockSetSelectedPoint}
			/>,
		)
		expect(container.firstChild).toHaveClass('cursor-pointer')
		expect(container.querySelector('.bg-teal-200')).toBeInTheDocument()
	})

	it('renders correctly with selected point', () => {
		const { container } = render(
			<CustomMarker
				location={mockLocation}
				selectedPoint={mockLocation}
				setSelectedPoint={mockSetSelectedPoint}
			/>,
		)
		expect(container.querySelector('.bg-white')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<CustomMarker
				location={mockLocation}
				selectedPoint={null}
				setSelectedPoint={mockSetSelectedPoint}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
