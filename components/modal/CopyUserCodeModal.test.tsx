/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@/test-utils'
import { store } from '@/redux/store'
import CopyUserCodeModal from './CopyUserCodeModal'
import { updateCopyUserCodeOpen, updateUserKey } from '@/redux/modal/modalSlice'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('CopyUserCodeModal', () => {
	it('renders when open and shows the user code', () => {
		// Arrange: open the modal and set a test user key
		store.dispatch(updateUserKey('TEST-CODE-123'))
		store.dispatch(updateCopyUserCodeOpen(true))

		// Act
		const { getByTestId, getByText } = render(<CopyUserCodeModal />)

		// Assert
		expect(getByTestId('modal-1')).toBeInTheDocument()
		expect(getByText('TEST-CODE-123')).toBeInTheDocument()
	})

	it('Should not have a11y violation', async () => {
		// Arrange: ensure modal is open with a test key
		store.dispatch(updateUserKey('TEST-CODE-123'))
		store.dispatch(updateCopyUserCodeOpen(true))

		// Act
		const { container } = render(<CopyUserCodeModal />)
		const result = await axe(container)

		// Assert
		expect(result).toHaveNoViolations()
	})
})
