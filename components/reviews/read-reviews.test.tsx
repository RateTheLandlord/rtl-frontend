/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import { Provider } from 'react-redux'
import ReviewForm from './read-reviews'
import { axe, toHaveNoViolations } from 'jest-axe'
import { store } from '@/redux/store'
expect.extend(toHaveNoViolations)

jest.mock('./review', () => {
	return {
		__esModule: true,
		default: () => <div>Review</div>,
	}
})

jest.mock('next/router', () => ({
	useRouter() {
		return {
			route: '/',
			pathname: '',
			query: '',
			asPath: '',
		}
	},
}))

describe('ReviewForm', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Provider store={store}>
				<ReviewForm />
			</Provider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
