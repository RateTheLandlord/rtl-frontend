import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async (ctx) => {
	const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/landlords`)
	const landlords = await req.json()
	const landlordSitemaps = landlords.map((item) => ({
		loc: `${process.env.NEXT_PUBLIC_DOMAIN_URL}${encodeURIComponent(item)}`,
		lastmod: new Date().toISOString(),
	}))

	const fields = [...landlordSitemaps]

	return getServerSideSitemap(ctx, fields)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Site() {}
