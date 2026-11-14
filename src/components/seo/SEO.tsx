import Head from 'next/head'
import { generateNextSeo } from 'next-seo/pages'
import type { NextSeoProps } from 'next-seo/pages'

const SEO = (props: NextSeoProps) => {
	return <Head>{generateNextSeo(props)}</Head>
}

export default SEO
