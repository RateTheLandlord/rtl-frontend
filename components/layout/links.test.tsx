/**
 * @jest-environment jsdom
 */
import { render } from '@/test-utils'
import { socialLinks } from './links'
// import { axe } from 'jest-axe'

describe('socialLinks', () => {
	it('should contain a Twitter link with the correct href', () => {
		const twitterLink = socialLinks.find((link) => link.name === 'Twitter')
		expect(twitterLink).toBeDefined()
		expect(twitterLink?.href).toBe('https://twitter.com/r8thelandlord')
	})

	it('should render the Twitter icon', () => {
		const twitterLink = socialLinks.find((link) => link.name === 'Twitter')
		const { container } = render(twitterLink?.icon as JSX.Element)
		expect(container.querySelector('svg')).toBeInTheDocument()
	})
	// it('Should not have a11y violation', async () => {
	// 	const { container } = render(<Footer />)
	// 	const result = await axe(container)
	// 	expect(result).toHaveNoViolations()
	// })
})
