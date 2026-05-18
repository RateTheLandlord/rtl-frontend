/**
 * @jest-environment jsdom
 */
import fs from 'fs'
import path from 'path'
import { render } from '@testing-library/react'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { NextIntlClientProvider } from 'next-intl'

const locale = 'en-CA'

interface Messages {
	[key: string]: string | Messages
}

function loadDefaultMessages(locale: string): Messages {
	const messagesDir = path.resolve(process.cwd(), 'messages', locale)
	const files = fs.readdirSync(messagesDir)

	const mergedMessages = files.reduce<Messages>((allMessages, file) => {
		if (!file.endsWith('.json')) return allMessages

		const messageData = JSON.parse(
			fs.readFileSync(path.join(messagesDir, file), 'utf8'),
		) as Messages

		return {
			...allMessages,
			...messageData,
		}
	}, {})

	function keyifyMessages(obj: Messages, prefix = ''): Messages {
		return Object.entries(obj).reduce<Messages>((result, [key, value]) => {
			const nextKey = prefix ? `${prefix}.${key}` : key
			if (typeof value === 'string') {
				result[key] = nextKey
			} else {
				result[key] = keyifyMessages(value, nextKey)
			}
			return result
		}, {})
	}

	return keyifyMessages(mergedMessages)
}

const defaultMessages = loadDefaultMessages(locale)

interface AllProvidersProps {
	children: ReactNode
	messages?: Messages // Optional messages for translations
}

const AllProviders = ({ children, messages }: AllProvidersProps) => {
	return (
		<NextIntlClientProvider
			locale={locale}
			messages={{ ...defaultMessages, ...messages }}
		>
			<UserProvider>
				<Provider store={store}>{children}</Provider>
			</UserProvider>
		</NextIntlClientProvider>
	)
}

// Custom render function that allows passing `messages` for translations
const customRender = (
	ui: React.ReactElement,
	{ messages, ...options }: { messages?: Messages } = {},
) =>
	render(ui, {
		wrapper: (props) => <AllProviders {...props} messages={messages} />,
		...options,
	})

export * from '@testing-library/react'
export { customRender as render }
