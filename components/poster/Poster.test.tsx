/**
 * @jest-environment jsdom
 */
import { render, screen } from '@/test-utils'
import Poster from './Poster'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Poster component', () => {
	it('renders the poster image with correct attributes', () => {
		render(<Poster />)
		const image = screen.getByAltText('Poster')
		expect(image).toBeInTheDocument()
		expect(image).toHaveAttribute(
			'src',
			'/_next/image?url=%2Fposter_picture.webp&w=640&q=75',
		)
		expect(image).toHaveAttribute('width', '270')
		expect(image).toHaveAttribute('height', '384')
	})

	it('renders the download link with correct attributes', () => {
		render(<Poster />)
		const link = screen.getByRole('link', { name: /download pdf/i })
		expect(link).toBeInTheDocument()
		expect(link).toHaveAttribute('href', '/poster/rtl_poster.pdf')
		expect(link).toHaveAttribute('download', '/poster/rtl_poster.pdf')
	})

	it('renders the download and share text', () => {
		render(<Poster />)
		const text = screen.getByText(/download and share our poster!/i)
		expect(text).toBeInTheDocument()
		expect(text).toHaveClass('mt-2 text-sm text-gray-600')
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(<Poster />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
