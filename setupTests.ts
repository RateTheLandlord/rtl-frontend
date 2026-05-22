import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

class MockResizeObserver implements ResizeObserver {
	constructor() {}
	observe = jest.fn()
	unobserve = jest.fn()
	disconnect = jest.fn()
	takeRecords = jest.fn().mockReturnValue([])
}

global.ResizeObserver = MockResizeObserver as typeof ResizeObserver

jest.mock('@auth0/nextjs-auth0/client', () => ({
	__esModule: true,
	UserProvider: ({ children }: { children: React.ReactNode }) =>
		React.createElement(React.Fragment, null, children),
	useUser: () => ({
		user: null,
		error: undefined,
		isLoading: false,
	}),
}))

jest.mock('next-recaptcha-v3', () => ({
	// Mock the useReCaptcha hook correctly
	useReCaptcha: jest.fn().mockReturnValue({
		executeRecaptcha: jest.fn().mockResolvedValue('mock-token'),
		resetRecaptcha: jest.fn(),
	}),
	// If needed, you can also mock ReCaptcha component, but it may not be necessary for your tests
	ReCaptcha: () => null,
}))

jest.mock('next/router', () => ({
	useRouter: jest.fn(() => ({
		route: '/',
		pathname: '/',
		query: {},
		asPath: '/',
		push: jest.fn(),
		replace: jest.fn(),
		back: jest.fn(),
	})),
}))
