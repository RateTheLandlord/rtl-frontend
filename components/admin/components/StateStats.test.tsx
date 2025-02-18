/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test-utils'
import StateStats from './StateStats'
import { axe } from 'jest-axe'

describe('StateStats', () => {
	const states = [
		{ key: 'State 1', total: '100' },
		{ key: 'State 2', total: '200' },
		{ key: 'State 3', total: '300' },
	]
	it('should render state stats correctly', () => {
		render(<StateStats states={states} />)

		states.forEach((state) => {
			const stateName = screen.queryByText(state.key)
			const stateTotal = screen.queryByText(state.total)

			expect(stateName).toBeInTheDocument()
			expect(stateTotal).toBeInTheDocument()
		})
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<StateStats states={states} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
