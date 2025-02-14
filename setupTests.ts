import '@testing-library/jest-dom/extend-expect'
import { toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
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
