/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ReportModal from './report-modal'
import { Review } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

jest.mock('next-recaptcha-v3', () => ({
	useReCaptcha: () => ({
		executeRecaptcha: jest.fn().mockResolvedValue('test-token'),
	}),
}))

const mockReview: Review = {
	id: 1,
	landlord: 'John Doe',
	country_code: 'US',
	city: 'New York',
	state: 'NY',
	zip: '10001',
	review: 'Great place to live!',
	repair: 5,
	health: 4,
	stability: 5,
	privacy: 4,
	respect: 5,
	date_added: new Date(),
	flagged: false,
	flagged_reason: '',
	admin_approved: true,
	admin_edited: false,
	rent: 2000,
	moderation_reason: null,
	moderator: null,
}

describe('ReportModal', () => {
	it('renders the modal when isOpen is true', () => {
		render(
			<ReportModal
				isOpen={true}
				setIsOpen={jest.fn()}
				selectedReview={mockReview}
			/>,
		)
		expect(screen.getByTestId('report-modal-1')).toBeInTheDocument()
	})

	it('does not render the modal when isOpen is false', () => {
		render(
			<ReportModal
				isOpen={false}
				setIsOpen={jest.fn()}
				selectedReview={mockReview}
			/>,
		)
		expect(screen.queryByTestId('report-modal-1')).not.toBeInTheDocument()
	})

	it('submits the report successfully', async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({}),
			}),
		) as jest.Mock

		render(
			<ReportModal
				isOpen={true}
				setIsOpen={jest.fn()}
				selectedReview={mockReview}
			/>,
		)

		fireEvent.change(screen.getByLabelText('report.select-reason'), {
			target: { value: 'fake' },
		})

		fireEvent.click(screen.getByText('reviews.report.submit'))

		await waitFor(() => {
			expect(screen.getByText('reviews.report.success')).toBeInTheDocument()
		})
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<ReportModal
				isOpen={true}
				setIsOpen={jest.fn()}
				selectedReview={mockReview}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
