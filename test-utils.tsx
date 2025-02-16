/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { NextIntlClientProvider } from 'next-intl'

interface AllProvidersProps {
	children: ReactNode
	messages?: Record<string, string> // Optional messages for translations
}

const AllProviders = ({ children, messages }: AllProvidersProps) => {
	const locale = 'en-CA'

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<UserProvider>
				<Provider store={store}>{children}</Provider>
			</UserProvider>
		</NextIntlClientProvider>
	)
}

// Custom render function that allows passing `messages` for translations
const customRender = (
	ui: React.ReactElement,
	{ messages, ...options }: { messages?: Record<string, string> } = {},
) =>
	render(ui, {
		wrapper: (props) => <AllProviders {...props} messages={messages} />,
		...options,
	})

export * from '@testing-library/react'
export { customRender as render }
