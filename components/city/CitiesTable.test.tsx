/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

import CitiesTable from './CitiesTable'

describe('CitiesTable Component', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(<CitiesTable state='ON' country='CA' />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
