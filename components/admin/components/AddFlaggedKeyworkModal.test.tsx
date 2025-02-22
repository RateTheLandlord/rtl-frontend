/**
 * @jest-environment jsdom
 */

import { render } from '@/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'
import AddFlaggedKeywordModal from './AddFlaggedKeywordModal'
expect.extend(toHaveNoViolations)

describe('Add Keyword Modal', () => {
	it('Should not have a11y violation', async () => {
		const { container } = render(
			<AddFlaggedKeywordModal
				keyword='test'
				setKeyword={() => jest.fn()}
				keywordReason='test reason'
				setKeywordReason={() => jest.fn()}
			/>,
		)
		const result = await axe(container)
		expect(result).toHaveNoViolations()
	})
})
