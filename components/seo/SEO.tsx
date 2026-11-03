import Head from 'next/head'
import { generateNextSeo } from 'next-seo/pages'
import type { NextSeoProps } from 'next-seo/pages'

interface SEOProps extends NextSeoProps {}

const SEO = (props: SEOProps) => {
	return <Head>{generateNextSeo(props)}</Head>
}

export default SEO
