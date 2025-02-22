/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import Review from './review'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { UserProvider } from '@auth0/nextjs-auth0/client'
expect.extend(toHaveNoViolations)

jest.mock('@/util/helpers/fetchReviews', () => ({
	fetchReviews: jest.fn().mockResolvedValue({
		reviews: [
			{
				id: 1,
				landlord: 'John Doe',
				country_code: 'US',
				city: 'New York',
				state: 'NY',
				zip: '10001',
				review: 'Great place to live!',
				repair: 5,
				health: 4,
				stability: 5,
				privacy: 4,
				respect: 5,
				date_added: new Date(),
				flagged: false,
				flagged_reason: '',
				admin_approved: true,
				admin_edited: false,
				rent: 2000,
				moderation_reason: null,
				moderator: null,
			},
		],
	}),
}))

jest.mock('@/util/helpers/fetchFilterOptions', () => ({
	fetchFilterOptions: jest.fn(),
}))

jest.mock('../Map/Map', () => {
	return {
		__esModule: true,
		default: () => <div>Map</div>,
	}
})

describe('Review Component', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<UserProvider>
					<Review
						isLoading={false}
						setIsLoading={jest.fn()}
						view={undefined}
						setLocationOpen={jest.fn()}
					/>
				</UserProvider>
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
