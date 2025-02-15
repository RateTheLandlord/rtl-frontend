/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import ResourceFilters from './resource-filters'
import { Options, SortOptions } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

const mockStore = configureStore([])

describe('ResourceFilters', () => {
	let store: ReturnType<typeof mockStore>

	beforeEach(() => {
		store = mockStore({
			resourceQuery: {
				searchFilter: '',
			},
			query: {
				searchFilter: '',
			},
		})
	})

	const defaultProps = {
		searchTitle: 'Search',
		selectedSort: { value: 'az', id: 1, name: 'Date' } as SortOptions,
		setSelectedSort: jest.fn(),
		sortOptions: [{ value: 'az', id: 1, name: 'Date' }] as SortOptions[],
		countryFilter: null,
		stateFilter: null,
		cityFilter: null,
		cityOptions: [] as Options[],
		stateOptions: [] as Options[],
		resource: true,
		loading: false,
		updateParams: jest.fn(),
	}

	it('renders without crashing', () => {
		render(
			<Provider store={store}>
				<ResourceFilters {...defaultProps} />
			</Provider>,
		)
		expect(screen.getByTestId('review-filters-1')).toBeInTheDocument()
	})

	it('calls updateParams on submit button click', () => {
		render(
			<Provider store={store}>
				<ResourceFilters {...defaultProps} />
			</Provider>,
		)
		const submitButton = screen.getByTestId('submit-button-1')
		fireEvent.click(submitButton)
		expect(defaultProps.updateParams).toHaveBeenCalled()
	})

	it('calls clearResourceFilters and updateParams on clear button click', () => {
		render(
			<Provider store={store}>
				<ResourceFilters {...defaultProps} />
			</Provider>,
		)
		const clearButton = screen.getByText('filters.clear')
		fireEvent.click(clearButton)
		expect(store.getActions()).toContainEqual({
			type: 'resourceQuery/clearResourceFilters',
		})
		expect(defaultProps.updateParams).toHaveBeenCalled()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<ResourceFilters {...defaultProps} />
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
