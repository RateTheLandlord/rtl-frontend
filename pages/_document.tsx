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
					{/* Umami Analytics & Google Ads */}
					{isProd && (
						<>
							<script
								async
								src='https://analytics-xi-brown.vercel.app/script.js'
								data-website-id='a3aff0b8-ee4d-4268-b8a2-35d023e3cad5'
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
