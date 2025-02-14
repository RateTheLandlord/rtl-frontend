/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import { Disclosure } from '@headlessui/react'
import MobileNav from './MobileNav'
import { INav } from '@/util/interfaces/interfaces'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('MobileNav', () => {
	const navigation: INav[] = [
		{
			href: '/reviews',
			name: 'layout.nav.reviews',
		},
		{
			href: '/resources',
			name: 'layout.nav.resources',
		},
		{
			href: '/about',
			name: 'layout.nav.about',
		},
	]

	it('renders MobileNav component correctly', () => {
		render(
			<Disclosure>
				<MobileNav navigation={navigation} activeTab='/' />
			</Disclosure>,
		)
	})
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<Disclosure>
				<MobileNav navigation={navigation} activeTab='/' />
			</Disclosure>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
