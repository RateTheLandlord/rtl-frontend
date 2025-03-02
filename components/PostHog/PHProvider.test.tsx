/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/unbound-method */
import React from 'react'
import { render } from '@testing-library/react'
import { PHProvider } from './PHProvider'
import posthog from 'posthog-js'
import { cookieConsentGiven } from './CookieBanner'
import { axe } from 'jest-axe'

jest.mock('posthog-js', () => ({
	init: jest.fn(),
	capture: jest.fn(),
	identify: jest.fn(),
	PostHogProvider: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}))

jest.mock('./CookieBanner', () => ({
	cookieConsentGiven: jest.fn(),
}))

describe('PHProvider', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should initialize posthog with correct parameters when window is defined', () => {
		;(cookieConsentGiven as jest.Mock).mockReturnValue('yes')

		render(
			<PHProvider>
				<div>Test</div>
			</PHProvider>,
		)

		expect(posthog.init).toHaveBeenCalledWith(
			process.env.NEXT_PUBLIC_POSTHOG_KEY,
			{
				api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
				person_profiles: 'always',
				persistence: 'localStorage+cookie',
			},
		)
	})

	it('should initialize posthog with memory persistence when cookie consent is not given', () => {
		;(cookieConsentGiven as jest.Mock).mockReturnValue('no')

		render(
			<PHProvider>
				<div>Test</div>
			</PHProvider>,
		)

		expect(posthog.init).toHaveBeenCalledWith(
			process.env.NEXT_PUBLIC_POSTHOG_KEY,
			{
				api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
				person_profiles: 'always',
				persistence: 'memory',
			},
		)
	})

	it('should render children correctly', () => {
		const { getByText } = render(
			<PHProvider>
				<div>Test</div>
			</PHProvider>,
		)

		expect(getByText('Test')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<PHProvider>
				<div>Test</div>
			</PHProvider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
