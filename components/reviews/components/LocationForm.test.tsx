/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import LocationForm from './LocationForm'
import { Options } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

const mockStateOptions: Options[] = [
	{ id: 1, name: 'State 1', value: 'state1' },
	{ id: 2, name: 'State 2', value: 'state2' },
]

jest.mock('@/util/helpers/getCountryCodes', () => ({
	countryOptions: [
		{ id: 1, name: 'Country 1', value: 'country1' },
		{ id: 2, name: 'Country 2', value: 'country2' },
	],
}))

jest.mock('@/util/countries/combineStates', () => ({
	getStates: () => mockStateOptions,
}))

describe('LocationForm', () => {
	const setSelectedCountry = jest.fn()
	const setSelectedState = jest.fn()

	it('renders country combobox', () => {
		render(
			<LocationForm
				selectedCountry={null}
				selectedState={null}
				setSelectedCountry={setSelectedCountry}
				setSelectedState={setSelectedState}
			/>,
		)

		expect(screen.getByText('reviews.select_country')).toBeInTheDocument()
		expect(screen.getByTestId('location-country-test')).toBeInTheDocument()
	})

	it('renders state combobox when a country is selected', () => {
		render(
			<LocationForm
				selectedCountry={{ id: 1, name: 'Country 1', value: 'country1' }}
				selectedState={null}
				setSelectedCountry={setSelectedCountry}
				setSelectedState={setSelectedState}
			/>,
		)

		expect(screen.getByText('reviews.select_state')).toBeInTheDocument()
		expect(screen.getByTestId('location-state-test')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<LocationForm
				selectedCountry={null}
				selectedState={null}
				setSelectedCountry={setSelectedCountry}
				setSelectedState={setSelectedState}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
