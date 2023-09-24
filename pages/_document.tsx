import Document, { Head, Html, Main, NextScript } from 'next/document'

const isProd = process.env.NODE_ENV === 'production'

export default class MyDocument extends Document {
	render(): JSX.Element {
		return (
			<Html>
				<Head />
				<body>
					<Main />
					<NextScript />
					{/* Umami Analytics & Google Ads */}
					{isProd && (
						<>
							<script
								async
								src='https://analytics.ratethelandlord.org/script.js'
								data-website-id='bf03e7c0-804f-44e3-9812-cae8ed8bca34'
							></script>
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
