import Document, { Head, Html, Main, NextScript } from 'next/document'

const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'

export default class MyDocument extends Document {
	render(): JSX.Element {
		return (
			<Html>
				<Head />
				<body>
					<Main />
					<NextScript />
					{/* Google Ads */}
					{isProd && (
						<>
							<script
								async
								src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1233437669445756'
								crossOrigin='anonymous'
							></script>
						</>
					)}
				</body>
			</Html>
		)
	}
}
