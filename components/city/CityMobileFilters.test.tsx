/**
 * @jest-environment jsdom
 */

import { render } from '@/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import CityMobileFilters from './CityMobileFilters'
expect.extend(toHaveNoViolations)

describe('CityMobileFilter Component', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<CityMobileFilters
					mobileFiltersOpen={true}
					setMobileFiltersOpen={() => jest.fn()}
					zipFilter={{ id: 1, name: 'test', value: '12345' }}
					updateParams={() => jest.fn()}
				/>
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
