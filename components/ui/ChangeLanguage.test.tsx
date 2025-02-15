/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChangeLanguage from './ChangeLanguage'
import { useRouter } from 'next/router'
import { changeLanguage as CL } from 'i18next'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}))

jest.mock('i18next', () => ({
	changeLanguage: jest.fn(),
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

	it('changes language when a new locale is selected', () => {
		render(<ChangeLanguage />)
		fireEvent.click(screen.getByRole('button'))
		fireEvent.click(screen.getByText('Français (Canada)'))

		expect(mockPush).toHaveBeenCalledWith('/', '/', { locale: 'fr-CA' })
		expect(CL).toHaveBeenCalledWith('fr-CA')
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<ChangeLanguage />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
