/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import MobileReviewFilters from './mobile-review-filters'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

const mockStore = configureStore([thunk])

describe('MobileReviewFilters', () => {
	let store: ReturnType<typeof mockStore>
	let setMobileFiltersOpen: jest.Mock

	beforeEach(() => {
		store = mockStore({
			query: {
				searchFilter: '',
			},
		})
		setMobileFiltersOpen = jest.fn()
	})

	const renderComponent = (props = {}) => {
		return render(
			<Provider store={store}>
				<MobileReviewFilters
					mobileFiltersOpen={true}
					setMobileFiltersOpen={setMobileFiltersOpen}
					countryFilter={null}
					stateFilter={null}
					cityFilter={null}
					zipFilter={null}
					dynamicCityOptions={[]}
					dynamicZipOptions={[]}
					updateParams={jest.fn()}
					dispatch={store.dispatch}
					fetchDynamicFilterOptions={jest.fn()}
					query={{
						selectedSort: {
							id: 1,
							name: 'test',
							value: 'az',
						},
						countryFilter: null,
						stateFilter: null,
						cityFilter: null,
						zipFilter: null,
						activeFilters: null,
						searchFilter: '',
					}}
					{...props}
				/>
			</Provider>,
		)
	}

	it('should render the component', () => {
		renderComponent()
		expect(screen.getByTestId('mobile-review-filters-1')).toBeInTheDocument()
	})

	it('should call setMobileFiltersOpen when close button is clicked', () => {
		renderComponent()
		fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
		expect(setMobileFiltersOpen).toHaveBeenCalledWith(false)
	})

	it('should call updateParams and setMobileFiltersOpen when Apply Filters button is clicked', () => {
		const updateParams = jest.fn()
		renderComponent({ updateParams })
		fireEvent.click(screen.getByText(/apply filters/i))
		expect(updateParams).toHaveBeenCalled()
		expect(setMobileFiltersOpen).toHaveBeenCalledWith(false)
	})

	it('Should not have a11y violation', async () => {
		const { container } = renderComponent()
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
