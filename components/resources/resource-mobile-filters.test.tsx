/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import ResourceMobileFilters from './resource-mobile-filters'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

const mockStore = configureStore([])

describe('ResourceMobileFilters', () => {
	let store: ReturnType<typeof mockStore>

	beforeEach(() => {
		store = mockStore({
			resourceQuery: {
				searchFilter: '',
			},
		})
		store.dispatch = jest.fn()
	})

	const defaultProps = {
		mobileFiltersOpen: true,
		setMobileFiltersOpen: jest.fn(),
		countryFilter: null,
		stateFilter: null,
		cityFilter: null,
		cityOptions: [],
		stateOptions: [],
		updateParams: jest.fn(),
	}

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<ResourceMobileFilters {...defaultProps} />
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
