/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import CityFilters from './CityFilters'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
expect.extend(toHaveNoViolations)

describe('CityFilter Component', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<CityFilters
					selectedSort={{ id: 1, name: 'test', value: 'az' }}
					sortOptions={[{ id: 1, name: 'test', value: 'az' }]}
					setSelectedSort={() => jest.fn()}
					zipFilter={{ id: 1, name: 'test', value: '12345' }}
					updateParams={() => jest.fn()}
					loading={false}
				/>
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
