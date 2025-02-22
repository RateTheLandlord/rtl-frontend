/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import InfiniteScroll from './InfiniteScrollResources'
import { Resource } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

const mockData: Resource[] = [
	{
		id: 1,
		name: 'Resource 1',
		href: '#',
		city: 'City 1',
		state: 'State 1',
		country_code: 'US',
		address: 'Address 1',
		phone_number: '123-456-7890',
		description: 'Description 1',
		date_added: new Date(),
	},
	{
		id: 2,
		name: 'Resource 2',
		href: '#',
		city: 'City 2',
		state: 'State 2',
		country_code: 'CA',
		address: 'Address 2',
		phone_number: '987-654-3210',
		description: 'Description 2',
		date_added: new Date(),
	},
]

describe('InfiniteScroll', () => {
	it('renders the initial content', () => {
		render(
			<InfiniteScroll
				data={mockData}
				setPage={jest.fn()}
				hasMore={true}
				isLoading={false}
				setIsLoading={jest.fn()}
			/>,
		)

		expect(screen.getByText('Resource 1')).toBeInTheDocument()
		expect(screen.getByText('Resource 2')).toBeInTheDocument()
	})

	it('calls setPage when scrolled to the bottom', () => {
		const setPage = jest.fn()
		const setIsLoading = jest.fn()

		render(
			<InfiniteScroll
				data={mockData}
				setPage={setPage}
				hasMore={true}
				isLoading={false}
				setIsLoading={setIsLoading}
			/>,
		)

		fireEvent.scroll(window, {
			target: { scrollY: document.body.offsetHeight },
		})

		expect(setIsLoading).toHaveBeenCalledWith(true)
		expect(setPage).toHaveBeenCalled()
	})

	it('shows the spinner when loading', () => {
		render(
			<InfiniteScroll
				data={mockData}
				setPage={jest.fn()}
				hasMore={true}
				isLoading={true}
				setIsLoading={jest.fn()}
			/>,
		)

		expect(screen.getByRole('status')).toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<InfiniteScroll
				data={mockData}
				setPage={jest.fn()}
				hasMore={true}
				isLoading={false}
				setIsLoading={jest.fn()}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
