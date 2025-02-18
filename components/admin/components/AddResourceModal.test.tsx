/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@/test-utils'
import AddResourceModal from './AddResourceModal'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('AddResourceModal', () => {
	const mockSetHref = jest.fn()

	const defaultProps = {
		name: '',
		setName: jest.fn(),
		country: '',
		setCountry: jest.fn(),
		city: '',
		setCity: jest.fn(),
		state: '',
		setState: jest.fn(),
		address: '',
		setAddress: jest.fn(),
		phone: '',
		setPhone: jest.fn(),
		description: '',
		setDescription: jest.fn(),
		href: '',
		setHref: mockSetHref,
	}

	it('should render the AddResourceModal component', () => {
		render(<AddResourceModal {...defaultProps} />)
		expect(screen.getByTestId('add-user-modal-1')).toBeInTheDocument()
	})

	it('should call setHref when the Link input changes', () => {
		render(<AddResourceModal {...defaultProps} />)
		const linkInput = screen.getByPlaceholderText('Link')
		fireEvent.change(linkInput, { target: { value: 'https://example.com' } })
		expect(mockSetHref).toHaveBeenCalledWith('https://example.com')
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<AddResourceModal {...defaultProps} />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
