/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Hero from './Hero'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { Options } from '@/util/interfaces/interfaces'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

const renderWithProviders = (ui: React.ReactElement) => {
	return render(
		<Provider store={store}>
			<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
		</Provider>,
	)
}

describe('Hero Component', () => {
	const countryFilter: Options = { value: 'US', id: 1, name: 'United States' }
	const stateFilter: Options = { value: 'CA', id: 2, name: 'California' }

	it('renders without crashing', () => {
		renderWithProviders(
			<Hero countryFilter={countryFilter} stateFilter={stateFilter} />,
		)
		expect(screen.getByTestId('submit-button-1')).toBeInTheDocument()
	})

	it('enables the button if both country and state are selected', () => {
		renderWithProviders(
			<Hero countryFilter={countryFilter} stateFilter={stateFilter} />,
		)
		const button = screen.getByTestId('submit-button-1')
		expect(button).toBeEnabled()
	})

	it('Should not have a11y violation', async () => {
		const { container } = renderWithProviders(
			<Hero countryFilter={countryFilter} stateFilter={stateFilter} />,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
