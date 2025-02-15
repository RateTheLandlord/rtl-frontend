/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ReviewFilters from './review-filters'
import { IQuery, Options, SortOptions } from '@/util/interfaces/interfaces'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

const mockProps = {
	selectedSort: { id: 1, name: 'az', value: 'az' } as SortOptions,
	sortOptions: [
		{ id: 1, name: 'az', value: 'az' },
		{ id: 2, name: 'za', value: 'za' },
	] as SortOptions[],
	setSelectedSort: jest.fn(),
	searchTitle: 'Search Reviews',
	countryFilter: { id: 1, name: 'USA', value: 'usa' } as Options,
	stateFilter: { id: 1, name: 'California', value: 'ca' } as Options,
	cityFilter: { id: 1, name: 'Los Angeles', value: 'la' } as Options,
	zipFilter: { id: 1, name: '90001', value: '90001' } as Options,
	dynamicCityOptions: [
		{ id: 1, name: 'Los Angeles', value: 'la' },
	] as Options[],
	zipOptions: [{ id: 1, name: '90001', value: '90001' }] as Options[],
	dynamicZipOptions: [{ id: 1, name: '90001', value: '90001' }] as Options[],
	updateParams: jest.fn(),
	loading: false,
	dispatch: jest.fn(),
	fetchDynamicFilterOptions: jest.fn(),
	query: { searchFilter: '' } as IQuery,
}

describe('ReviewFilters Component', () => {
	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<ReviewFilters {...mockProps} />
			</Provider>,
		)
		expect(screen.getByTestId('review-filters-1')).toBeInTheDocument()
	})

	it('calls dispatch and updateParams on submit button click', () => {
		render(
			<Provider store={store}>
				<ReviewFilters {...mockProps} />
			</Provider>,
		)
		fireEvent.click(screen.getByTestId('submit-button-1'))
		expect(mockProps.updateParams).toHaveBeenCalled()
	})

	it('calls dispatch and updateParams on clear button click', () => {
		render(
			<Provider store={store}>
				<ReviewFilters {...mockProps} />
			</Provider>,
		)
		fireEvent.click(screen.getByText('reviews.clear'))
		expect(mockProps.dispatch).toHaveBeenCalled()
		expect(mockProps.updateParams).toHaveBeenCalled()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<ReviewFilters {...mockProps} />
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
