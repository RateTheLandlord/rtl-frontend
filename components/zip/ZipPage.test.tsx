/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ZipPage from './ZipPage'
import { IZipReviews } from '@/lib/review/review'
import { axe, toHaveNoViolations } from 'jest-axe'
import { UserProvider } from '@auth0/nextjs-auth0/client'
expect.extend(toHaveNoViolations)

jest.mock('@/util/helpers/fetchReviews')

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

const mockData: IZipReviews = {
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
	average: 4.5,
	total: 1,
	catAverages: {
		avg_repair: 5,
		avg_health: 4,
		avg_stability: 5,
		avg_privacy: 4,
		avg_respect: 5,
	},
}

describe('ZipPage', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<UserProvider>
				<ZipPage
					city='Test City'
					state='Test State'
					country='Test Country'
					zip='12345'
					data={mockData}
				/>
			</UserProvider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
