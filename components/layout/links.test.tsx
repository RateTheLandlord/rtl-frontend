/** @jest-environment jsdom */

import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { navigation, socialLinks } from './links'
import Instagram from '@/components/svg/social/instagram'

expect.extend(toHaveNoViolations)

describe('links exports', () => {
	test('navigation contains the expected route metadata', () => {
		expect(navigation).toEqual([
			{ href: '/reviews', name: 'nav.reviews' },
			{ href: '/resources', name: 'nav.resources' },
			{ href: '/about', name: 'nav.about' },
			{ href: '/faq', name: 'nav.faq' },
		])
	})

	test('socialLinks contains the expected Instagram entry', () => {
		expect(socialLinks).toHaveLength(1)
		expect(socialLinks[0]).toMatchObject({
			name: 'Instagram',
			href: 'https://www.instagram.com/ratethelandlord',
		})

		expect(React.isValidElement(socialLinks[0].icon)).toBe(true)
		const iconElement = socialLinks[0].icon as React.ReactElement
		expect(iconElement.type).toBe(Instagram)
	})

	test('Should not have a11y violation', async () => {
		const { container } = render(
			<nav aria-label='Primary navigation'>
				<ul>
					{navigation.map((item) => (
						<li key={item.href}>
							<a href={item.href}>{item.name}</a>
						</li>
					))}
				</ul>
				<a href={socialLinks[0].href} aria-label={socialLinks[0].name}>
					{socialLinks[0].icon}
				</a>
			</nav>,
		)

		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
