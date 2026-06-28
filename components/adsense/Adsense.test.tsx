/** @jest-environment jsdom */
import React from 'react'
import { render, screen } from '@/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

jest.mock('react-adsense', () => ({
	Google: jest.fn(() => <div data-testid='adsense-google' />),
}))

describe('AdsComponent', () => {
	const originalEnv = process.env.NEXT_PUBLIC_ENVIRONMENT

	afterEach(() => {
		process.env.NEXT_PUBLIC_ENVIRONMENT = originalEnv
		jest.resetModules()
		jest.clearAllMocks()
	})

	it('renders the AdSense component in production', async () => {
		process.env.NEXT_PUBLIC_ENVIRONMENT = 'production'
		const { default: AdsComponent } = await import('./Adsense')

		render(<AdsComponent slot='123456' />)

		expect(screen.getByTestId('adsense-google')).toBeInTheDocument()
	})

	it('renders a placeholder block in non-production', async () => {
		process.env.NEXT_PUBLIC_ENVIRONMENT = 'development'
		const { default: AdsComponent } = await import('./Adsense')

		render(<AdsComponent slot='123456' />)

		expect(screen.getByText('AD')).toBeInTheDocument()
	})

	it('should not have a11y violations', async () => {
		process.env.NEXT_PUBLIC_ENVIRONMENT = 'production'
		const { default: AdsComponent } = await import('./Adsense')
		const { container } = render(<AdsComponent slot='123456' />)
		const result = await axe(container)

		expect(result).toHaveNoViolations()
	})
})
