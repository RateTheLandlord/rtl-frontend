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
import UserEditReviewModal from './UserEditReviewModal'

// ---- Mocks ----
jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}))

jest.mock('react-toastify', () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
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

const baseStore = {
	modal: {
		selectedReview: {
			id: 1,
			landlord: 'John Doe',
			country_code: 'CA',
			city: 'Toronto',
			state: 'ON',
			zip: 'M5V',
			review: 'Nice place',
			rent: 2000,
		},
		userKey: '',
		userEditReviewOpen: true,
	},
}

function renderModal(storeOverride = baseStore) {
	const store = mockStore(storeOverride)
	return {
		store,
		...render(
			<Provider store={store}>
				<UserEditReviewModal />
			</Provider>,
		),
	}
}

// ---- Tests ----
describe('UserEditReviewModal', () => {
	it('renders modal fields when open', () => {
		renderModal()

		expect(screen.getByLabelText('user-edit.landlord')).toBeInTheDocument()
		expect(screen.getByLabelText('user-edit.city')).toBeInTheDocument()
		expect(screen.getByLabelText('user-edit.review')).toBeInTheDocument()
		expect(screen.getByText('user-edit.submit')).toBeInTheDocument()
	})

	it('allows user to edit landlord', () => {
		renderModal()

		const landlordInput = screen.getByTestId('create-review-form-landlord-1')
		fireEvent.change(landlordInput, { target: { value: 'New Landlord' } })

		expect(landlordInput).toHaveValue('New Landlord')
	})

	it('dispatches close actions when cancel clicked', () => {
		const { store } = renderModal()

		fireEvent.click(screen.getByText('user-edit.cancel'))

		const actions = store.getActions()
		expect(actions.some((a) => a.type === 'modal/updateSelectedReview')).toBe(
			true,
		)
		expect(
			actions.some((a) => a.type === 'modal/updateUserEditReviewOpen'),
		).toBe(true)
	})

	it('updates user code when typing in code field', () => {
		const { store } = renderModal()

		const codeInput = screen.getByTestId(
			'create-review-form-moderation-reason-1',
		)
		fireEvent.change(codeInput, { target: { value: 'abc123' } })

		const actions = store.getActions()
		expect(actions.some((a) => a.type === 'modal/updateUserKey')).toBe(true)
	})

	it('submits edited review and calls fetch', async () => {
		renderModal()

		fireEvent.click(screen.getByText('user-edit.submit'))

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalled()
		})
	})
	it('Should not have a11y violation', async () => {
		const { container } = renderModal()
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
