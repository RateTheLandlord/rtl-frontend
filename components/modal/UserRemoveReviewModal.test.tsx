/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import UserRemoveReviewModal from './UserRemoveReviewModal'
import { Store } from 'redux'

// Mocks
jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}))

jest.mock('posthog-js', () => ({
	capture: jest.fn(),
}))

global.fetch = jest.fn(() =>
	Promise.resolve({
		ok: true,
		json: () => Promise.resolve({ success: true }),
	}),
) as jest.Mock

const mockStore = configureStore([thunk])

function renderWithStore(store: Store) {
	return render(
		<Provider store={store}>
			<UserRemoveReviewModal />
		</Provider>,
	)
}

describe('UserRemoveReviewModal', () => {
	it('renders landlord and review when open', () => {
		const store = mockStore({
			modal: {
				selectedReview: {
					id: 1,
					landlord: 'John Doe',
					review: 'Great landlord!',
				},
				userKey: '',
				userRemoveReviewOpen: true,
			},
		})

		renderWithStore(store)

		expect(screen.getByText(/user-delete.landlord/i)).toBeInTheDocument()
		expect(screen.getByText(/John Doe/)).toBeInTheDocument()
		expect(screen.getByText(/Great landlord!/)).toBeInTheDocument()
	})

	it('dispatches close modal on Cancel click', () => {
		const store = mockStore({
			modal: {
				selectedReview: { id: 1, landlord: 'LL', review: 'RR' },
				userKey: '',
				userRemoveReviewOpen: true,
			},
		})

		renderWithStore(store)

		fireEvent.click(screen.getByText(/user-delete.cancel/i))

		const actions = store.getActions()
		expect(actions.some((a) => a.type === 'modal/updateSelectedReview')).toBe(
			true,
		)
		expect(
			actions.some((a) => a.type === 'modal/updateUserRemoveReviewOpen'),
		).toBe(true)
	})

	it('calls fetch when submitting', async () => {
		const store = mockStore({
			modal: {
				selectedReview: { id: 1, landlord: 'LL', review: 'RR' },
				userKey: 'abc123',
				userRemoveReviewOpen: true,
			},
		})

		renderWithStore(store)

		fireEvent.click(screen.getByText(/user-delete.submit/i))

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalled()
		})
	})
	it('Should not have a11y violation', async () => {
		const store = mockStore({
			modal: {
				selectedReview: { id: 1, landlord: 'LL', review: 'RR' },
				userKey: '',
				userRemoveReviewOpen: true,
			},
		})
		const { container } = renderWithStore(store)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
