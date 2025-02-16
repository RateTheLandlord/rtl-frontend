/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@/test-utils'
import EditResourceModal from './EditResourceModal'
import { Resource } from '@/util/interfaces/interfaces'
import '@testing-library/jest-dom/extend-expect'
import { axe, toHaveNoViolations } from 'jest-axe'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
expect.extend(toHaveNoViolations)

const mockHandleMutate = jest.fn()
const mockSetEditResourceOpen = jest.fn()
const mockSetSelectedResource = jest.fn()

const mockResource: Resource = {
	id: 1,
	name: 'Test Resource',
	country_code: 'CA',
	city: 'Test City',
	state: 'Test State',
	address: '123 Test St',
	phone_number: '123-456-7890',
	description: 'Test Description',
	href: 'http://test.com',
	date_added: new Date(),
}

describe('EditResourceModal', () => {
	it('renders the modal with the correct initial values', () => {
		render(
			<UserProvider>
				<Provider store={store}>
					<EditResourceModal
						selectedResource={mockResource}
						handleMutate={mockHandleMutate}
						setEditResourceOpen={mockSetEditResourceOpen}
						editResourceOpen={true}
						setSelectedResource={mockSetSelectedResource}
					/>
				</Provider>
			</UserProvider>,
		)

		expect(screen.getByPlaceholderText('Name')).toHaveValue(mockResource.name)
		expect(screen.getByPlaceholderText('Address')).toHaveValue(
			mockResource.address,
		)
		expect(screen.getByPlaceholderText('Phone Number')).toHaveValue(
			mockResource.phone_number,
		)
		expect(screen.getByPlaceholderText('Link')).toHaveValue(mockResource.href)
	})

	it('calls setEditResourceOpen with false when the cancel button is clicked', () => {
		render(
			<UserProvider>
				<Provider store={store}>
					<EditResourceModal
						selectedResource={mockResource}
						handleMutate={mockHandleMutate}
						setEditResourceOpen={mockSetEditResourceOpen}
						editResourceOpen={true}
						setSelectedResource={mockSetSelectedResource}
					/>
				</Provider>
			</UserProvider>,
		)

		const cancelButton = screen.getByText('Cancel')
		fireEvent.click(cancelButton)

		expect(mockSetEditResourceOpen).toHaveBeenCalledWith(false)
		expect(mockSetSelectedResource).toHaveBeenCalledWith(undefined)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<UserProvider>
				<Provider store={store}>
					<EditResourceModal
						selectedResource={mockResource}
						handleMutate={mockHandleMutate}
						setEditResourceOpen={mockSetEditResourceOpen}
						editResourceOpen={true}
						setSelectedResource={mockSetSelectedResource}
					/>
				</Provider>
			</UserProvider>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
