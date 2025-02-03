/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Banner from './CookieBanner'
import { usePostHog } from 'posthog-js/react'
import { useTranslation } from 'next-i18next'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('posthog-js/react', () => ({
	usePostHog: jest.fn(),
}))

jest.mock('next-i18next', () => ({
	useTranslation: jest.fn(),
}))

describe('Banner', () => {
	const setItemMock = jest.spyOn(Storage.prototype, 'setItem')
	const getItemMock = jest.spyOn(Storage.prototype, 'getItem')

	beforeEach(() => {
		;(usePostHog as jest.Mock).mockReturnValue({
			set_config: jest.fn(),
		})
		;(useTranslation as jest.Mock).mockReturnValue({
			t: (key: string) => key,
		})
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('renders the banner when consent is undecided', () => {
		getItemMock.mockReturnValueOnce(null)
		render(<Banner />)

		expect(screen.getByText('cookie.privacy')).toBeInTheDocument()
		expect(screen.getByText('cookie.accept')).toBeInTheDocument()
		expect(screen.getByText('cookie.decline')).toBeInTheDocument()
	})

	it('sets consent to yes when accept button is clicked', () => {
		getItemMock.mockReturnValueOnce(null)
		render(<Banner />)
		fireEvent.click(screen.getByText('cookie.accept'))
		expect(setItemMock).toHaveBeenCalledWith('cookie_consent', 'yes')
		expect(usePostHog().set_config).toHaveBeenCalledWith({
			persistence: 'localStorage+cookie',
		})
	})

	it('sets consent to no when decline button is clicked', () => {
		getItemMock.mockReturnValueOnce(null)
		render(<Banner />)
		fireEvent.click(screen.getByText('cookie.decline'))
		expect(setItemMock).toHaveBeenCalledWith('cookie_consent', 'no')
		expect(usePostHog().set_config).toHaveBeenCalledWith({
			persistence: 'memory',
		})
	})

	it('does not render the banner when consent is already given', () => {
		getItemMock.mockReturnValueOnce('yes')
		render(<Banner />)
		expect(screen.queryByText('cookie.body-1')).not.toBeInTheDocument()
		expect(screen.queryByText('cookie.privacy')).not.toBeInTheDocument()
		expect(screen.queryByText('cookie.body-2')).not.toBeInTheDocument()
		expect(screen.queryByText('cookie.accept')).not.toBeInTheDocument()
		expect(screen.queryByText('cookie.decline')).not.toBeInTheDocument()
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<Banner />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
