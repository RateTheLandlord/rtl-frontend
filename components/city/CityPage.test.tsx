/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import CityPage from './CityPage'
import { ICityReviews } from '@/lib/review/review'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { axe } from 'jest-axe'

const mockData: ICityReviews = {
	reviews: [],
	average: 0,
	total: 0,
	catAverages: {
		avg_repair: 0,
		avg_health: 0,
		avg_stability: 0,
		avg_privacy: 0,
		avg_respect: 0,
	},

	zips: [],
}

describe('CityPage', () => {
	it('should render', () => {
		render(
			<Provider store={store}>
				<CityPage
					city='Test City'
					state='Test State'
					country='Test Country'
					data={mockData}
				/>
			</Provider>,
		)

		// Check if the sort option is rendered correctly
		expect(screen.getByTestId('city-page')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<CityPage
					city='Test City'
					state='Test State'
					country='Test Country'
					data={mockData}
				/>
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
