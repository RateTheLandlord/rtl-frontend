import sql from '@/lib/db'
import { Keywords } from '@/util/interfaces/interfaces'

export async function createKeyword(
	keyword: Keywords,
): Promise<Keywords | undefined> {
	try {
		keyword.keyword = keyword.keyword.substring(0, 150).toLocaleUpperCase()

		const id = await sql<{ id: number }[]>`
					INSERT INTO keyword_flags
					(keyword, reason)
					VALUES
					(${keyword.keyword}, ${keyword.reason}) RETURNING id;
				`

		keyword.id = id[0].id

		return keyword
	} catch {
		console.error('Failed to create Keyword')
	}
}
