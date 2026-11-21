import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'

export async function GET() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/review/landlords`,
	)
	const landlords = (await response.json()) as string[]
	const fields: ISitemapField[] = landlords.map((landlord) => ({
		loc: `${process.env.NEXT_PUBLIC_DOMAIN_URL}${encodeURIComponent(landlord)}`,
		lastmod: new Date().toISOString(),
	}))

	return getServerSideSitemap(fields)
}
