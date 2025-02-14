/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import ReviewComponent from './ReviewComponent'
import { Review } from '@/util/interfaces/interfaces'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('@auth0/nextjs-auth0/client')
jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

const review: Review = {
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
}

describe('ReviewComponent', () => {
	// TODO Fix This
	// it('renders review component', () => {
	// 	render(
	// 		<UserProvider>
	// 			<ReviewComponent
	// 				review={review}
	// 				handleReport={jest.fn()}
	// 				handleDelete={jest.fn()}
	// 				handleEdit={jest.fn()}
	// 			/>
	// 		</UserProvider>,
	// 	)

	// 	expect(screen.getByText('John Doe')).toBeInTheDocument()
	// 	expect(screen.getByText('reviews.read-all')).toBeInTheDocument()
	// 	expect(screen.getByText('New York, NY, US, 10001')).toBeInTheDocument()
	// 	expect(screen.getByText('Great place to live!')).toBeInTheDocument()
	// })

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<UserProvider>
				<ReviewComponent
					review={review}
					handleReport={jest.fn()}
					handleDelete={jest.fn()}
					handleEdit={jest.fn()}
				/>
			</UserProvider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
