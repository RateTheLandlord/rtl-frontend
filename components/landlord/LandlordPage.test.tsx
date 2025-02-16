/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test-utils'
import LandlordPage from './LandlordPage'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { axe } from 'jest-axe'
import { ILandlordReviews } from '@/lib/review/types/Queries'

describe('LandlordPage', () => {
	const landlord = 'John Doe'
	const data: ILandlordReviews = {
		reviews: [
			{
				city: 'Testville',
				country_code: 'CA',
				health: 3,
				id: 123,
				landlord: 'John Doe',
				privacy: 1,
				repair: 1,
				respect: 1,
				review:
					"I'm going to write stuff here so that it models the average review, we'll expand these later to include weird stuff.",
				stability: 5,
				state: 'AB',
				zip: 'T1T 1T1',
				flagged: false,
				flagged_reason: '',
				admin_approved: null,
				admin_edited: false,
				date_added: new Date(),
				moderation_reason: null,
				moderator: null,
				delete_date: null,
				delete_reason: null,
				deleted_by: null,
				restore_date: null,
				restore_reason: null,
				restored_by: null,
			},
			// ... add more sample reviews if needed
		],
		average: 5,
		total: 5,
		catAverages: {
			avg_health: 5,
			avg_privacy: 5,
			avg_repair: 5,
			avg_respect: 5,
			avg_stability: 5,
		},
	}

	beforeEach(() => {
		render(
			<UserProvider>
				<LandlordPage landlord={landlord} data={data} />
			</UserProvider>,
		)
	})

	it('renders the landlord information', () => {
		const landlordInfo = screen.getByText(landlord)
		expect(landlordInfo).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<UserProvider>
				<LandlordPage landlord={landlord} data={data} />
			</UserProvider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
