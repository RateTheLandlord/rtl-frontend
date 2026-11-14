/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test-utils'
import '@testing-library/jest-dom'
import ChangeLanguage from './ChangeLanguage'
import { useRouter } from 'next/router'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

describe('ChangeLanguage component', () => {
	const mockPush = jest.fn()
	const mockRouter = {
		locale: 'en-CA',
		locales: ['en-CA', 'fr-CA'],
		asPath: '/',
		push: mockPush,
	}

	beforeEach(() => {
		;(useRouter as jest.Mock).mockReturnValue(mockRouter)
	})

	it('renders correctly with initial locale', () => {
		render(<ChangeLanguage />)
		expect(screen.getByText('English')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<ChangeLanguage />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
