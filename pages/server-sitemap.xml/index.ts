import { getServerSideSitemap, ISitemapField } from 'next-sitemap'

export const getServerSideProps = async (ctx: ISitemapField[]) => {
	const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/landlords`)
	const landlords = (await req.json()) as Array<string>
	const landlordSitemaps = landlords.map((item) => ({
		loc: `${process.env.NEXT_PUBLIC_DOMAIN_URL}${encodeURIComponent(item)}`,
		lastmod: new Date().toISOString(),
	}))

	const fields = [...landlordSitemaps]

	return getServerSideSitemap(ctx, fields)
}

export default function Site() {}
