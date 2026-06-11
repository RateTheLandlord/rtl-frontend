/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@/test-utils'
import Spinner from './Spinner'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Spinner component', () => {
	it('renders correctly with default props', () => {
		const { container } = render(<Spinner />)
		const spinner = container.querySelector('div[role="status"]')
		expect(spinner).toBeInTheDocument()
		expect(spinner).toHaveClass('h-8 w-8 text-primary')
	})

	it('renders correctly with custom height and width', () => {
		const { container } = render(<Spinner height='h-10' width='w-10' />)
		const spinner = container.querySelector('div[role="status"]')
		expect(spinner).toBeInTheDocument()
		expect(spinner).toHaveClass('h-10 w-10')
	})

	it('renders correctly with custom colour', () => {
		const { container } = render(<Spinner colour='text-red-600' />)
		const spinner = container.querySelector('div[role="status"]')
		expect(spinner).toBeInTheDocument()
		expect(spinner).toHaveClass('text-red-600')
	})

	it('contains the loading text for accessibility', () => {
		const { getByText } = render(<Spinner />)
		const loadingText = getByText('Loading...')
		expect(loadingText).toBeInTheDocument()
		expect(loadingText).toHaveClass(
			'!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]',
		)
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<Spinner />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
