/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@/test-utils'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import ReviewForm from './ReadReviews'
import { axe, toHaveNoViolations } from 'jest-axe'
import { store } from '@/redux/store'
expect.extend(toHaveNoViolations)

jest.mock('./Review', () => {
	return {
		__esModule: true,
		default: () => <div>Review</div>,
	}
})

jest.mock('@/i18n/navigation', () => ({
	useRouter() {
		return { push: jest.fn() }
	},
}))

describe('ReviewForm', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<ReviewForm routeParams={{}} />
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
