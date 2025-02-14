/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
import { render, screen, fireEvent } from '@testing-library/react'
import ReviewHero from './CreateReviewHero'

jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key, // Mock translation function
	}),
}))

describe('ReviewHero Component', () => {
	let setGetStartedMock: jest.Mock
	let setLandlordOpenMock: jest.Mock

	beforeEach(() => {
		setGetStartedMock = jest.fn()
		setLandlordOpenMock = jest.fn()
	})

	it('renders the ReviewHero component', () => {
		render(
			<ReviewHero
				getStarted={false}
				setGetStarted={setGetStartedMock}
				setLandlordOpen={setLandlordOpenMock}
			/>,
		)

		// Check if the component renders correctly
		expect(screen.getByTestId('ReviewHero-component')).toBeInTheDocument()

		// Check if the hero title and body text are displayed
		expect(screen.getByText('create-review.hero.title')).toBeInTheDocument()
		expect(screen.getByText('create-review.hero.body')).toBeInTheDocument()

		// Check if the HouseIcon is present
		expect(screen.getByTestId('HouseIcon-component')).toBeInTheDocument()

		// Check if the "Get Started" button is rendered
		expect(screen.getByTestId('submit-button-1')).toBeInTheDocument()
	})

	it('hides HouseIcon and button when getStarted is true', () => {
		render(
			<ReviewHero
				getStarted={true}
				setGetStarted={setGetStartedMock}
				setLandlordOpen={setLandlordOpenMock}
			/>,
		)

		// HouseIcon should not be in the document
		expect(screen.queryByTestId('HouseIcon-component')).not.toBeInTheDocument()

		// "Get Started" button should not be in the document
		expect(
			screen.queryByRole('button', { name: 'create-review.hero.start' }),
		).not.toBeInTheDocument()
	})

	it('calls setGetStarted and setLandlordOpen when button is clicked', () => {
		render(
			<ReviewHero
				getStarted={false}
				setGetStarted={setGetStartedMock}
				setLandlordOpen={setLandlordOpenMock}
			/>,
		)

		const button = screen.getByTestId('submit-button-1')

		fireEvent.click(button)

		expect(setGetStartedMock).toHaveBeenCalledWith(true)
		expect(setLandlordOpenMock).toHaveBeenCalledWith(true)
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(
			<ReviewHero
				getStarted={false}
				setGetStarted={setGetStartedMock}
				setLandlordOpen={setLandlordOpenMock}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
