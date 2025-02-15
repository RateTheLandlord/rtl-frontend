/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import InfiniteScroll from './InfiniteScroll'
import { Review } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
import { UserProvider } from '@auth0/nextjs-auth0/client'
expect.extend(toHaveNoViolations)

const mockData: Review[] = [
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
		delete_date: null,
		delete_reason: null,
		deleted_by: null,
		restore_date: null,
		restore_reason: null,
		restored_by: null,
	},
	{
		id: 2,
		landlord: 'Jane Smith',
		country_code: 'US',
		city: 'Los Angeles',
		state: 'CA',
		zip: '90001',
		review: 'Not bad, but could be better.',
		repair: 3,
		health: 3,
		stability: 3,
		privacy: 3,
		respect: 3,
		date_added: new Date(),
		flagged: false,
		flagged_reason: '',
		admin_approved: true,
		admin_edited: false,
		rent: 1500,
		moderation_reason: null,
		moderator: null,
		delete_date: null,
		delete_reason: null,
		deleted_by: null,
		restore_date: null,
		restore_reason: null,
		restored_by: null,
	},
]

const setReportOpen = jest.fn()
const setSelectedReview = jest.fn()
const setRemoveReviewOpen = jest.fn()
const setEditReviewOpen = jest.fn()
const setPage = jest.fn()
const setIsLoading = jest.fn()

describe('InfiniteScroll', () => {
	it('renders the ReviewTable with initial data', () => {
		render(
			<UserProvider>
				<InfiniteScroll
					data={mockData}
					setReportOpen={setReportOpen}
					setSelectedReview={setSelectedReview}
					setRemoveReviewOpen={setRemoveReviewOpen}
					setEditReviewOpen={setEditReviewOpen}
					setPage={setPage}
					hasMore={true}
					isLoading={false}
					setIsLoading={setIsLoading}
				/>
			</UserProvider>,
		)

		expect(screen.getByText('John Doe')).toBeInTheDocument()
		expect(screen.getByText('Jane Smith')).toBeInTheDocument()
	})

	it('calls setPage and setIsLoading when scrolled to bottom', () => {
		render(
			<UserProvider>
				<InfiniteScroll
					data={mockData}
					setReportOpen={setReportOpen}
					setSelectedReview={setSelectedReview}
					setRemoveReviewOpen={setRemoveReviewOpen}
					setEditReviewOpen={setEditReviewOpen}
					setPage={setPage}
					hasMore={true}
					isLoading={false}
					setIsLoading={setIsLoading}
				/>
			</UserProvider>,
		)

		fireEvent.scroll(window, {
			target: { scrollY: document.body.offsetHeight },
		})

		expect(setIsLoading).toHaveBeenCalledWith(true)
		expect(setPage).toHaveBeenCalled()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<UserProvider>
				<InfiniteScroll
					data={mockData}
					setReportOpen={setReportOpen}
					setSelectedReview={setSelectedReview}
					setRemoveReviewOpen={setRemoveReviewOpen}
					setEditReviewOpen={setEditReviewOpen}
					setPage={setPage}
					hasMore={true}
					isLoading={false}
					setIsLoading={setIsLoading}
				/>
			</UserProvider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
