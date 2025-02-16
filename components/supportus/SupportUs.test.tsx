/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/test-utils'
import '@testing-library/jest-dom/extend-expect'
import Support from './SupportUs'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

describe('Support', () => {
	it('renders the support us header', () => {
		render(<Support />)
		expect(screen.getByText('support.support-us')).toBeInTheDocument()
	})

	it('renders the main header', () => {
		render(<Support />)
		expect(screen.getByText('support.header')).toBeInTheDocument()
	})

	it('renders the body text', () => {
		render(<Support />)
		expect(screen.getByText('support.body-1')).toBeInTheDocument()
		expect(screen.getByText('support.body-2')).toBeInTheDocument()
		expect(screen.getByText('support.body-3')).toBeInTheDocument()
	})

	it('renders the features', () => {
		render(<Support />)
		expect(
			screen.getByText('support.features.platform.title'),
		).toBeInTheDocument()
		expect(
			screen.getByText('support.features.platform.description'),
		).toBeInTheDocument()
		expect(
			screen.getByText('support.features.maintenance.title'),
		).toBeInTheDocument()
		expect(
			screen.getByText('support.features.maintenance.description'),
		).toBeInTheDocument()
		expect(
			screen.getByText('support.features.community.title'),
		).toBeInTheDocument()
		expect(
			screen.getByText('support.features.community.description'),
		).toBeInTheDocument()
	})

	it('renders the Patreon link button', () => {
		render(<Support />)
		expect(screen.getByText('Patreon')).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /Patreon/i })).toHaveAttribute(
			'href',
			'https://patreon.com/RateTheLandlord?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=creatorshare_creator&utm_content=join_link',
		)
	})

	it('Should not have a11y violation', async () => {
		const { container } = render(<Support />)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
