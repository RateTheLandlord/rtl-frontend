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
import ReportModal from './report-modal'

// ---- Mocks ----
jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key, // returns key
}))

jest.mock('next-recaptcha-v3', () => ({
	useReCaptcha: () => ({
		executeRecaptcha: jest.fn(() => Promise.resolve('recaptcha-token')),
	}),
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
		selectedReview: { id: 10 },
		userReportModalOpen: true,
	},
}

function renderModal(storeOverride = baseStore) {
	const store = mockStore(storeOverride)
	return {
		store,
		...render(
			<Provider store={store}>
				<ReportModal />
			</Provider>,
		),
	}
}

// ---- Tests ----
describe('ReportModal', () => {
	it('renders modal when open', () => {
		renderModal()

		expect(screen.getByTestId('report-modal-1')).toBeInTheDocument()
		expect(screen.getByText('report.report')).toBeInTheDocument()
	})

	it('allows selecting a different report reason', () => {
		renderModal()

		const select = screen.getByLabelText('report.select-reason')

		fireEvent.change(select, { target: { value: 'fake' } })

		expect((select as HTMLSelectElement).value).toBe('fake')
	})

	it('shows textarea when selecting "other"', () => {
		renderModal()

		const select = screen.getByLabelText('report.select-reason')

		fireEvent.change(select, { target: { value: 'other' } })

		expect(
			screen.getByPlaceholderText('Write your reasoning here...'),
		).toBeInTheDocument()
	})

	it('submits report and calls fetch', async () => {
		renderModal()

		const submit = screen.getByText('report.submit')

		fireEvent.click(submit)

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledTimes(1)
		})
	})

	it('dispatches close action when cancel clicked', () => {
		const { store } = renderModal()

		fireEvent.click(screen.getByText('report.cancel'))

		const actions = store.getActions()

		expect(actions.some((a) => a.type === 'modal/updateUserReportModal')).toBe(
			true,
		)
	})
	it('Should not have a11y violation', async () => {
		const { container } = renderModal()
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
