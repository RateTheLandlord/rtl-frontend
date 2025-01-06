import sql from '@/lib/db'
import { Keywords } from '@/util/interfaces/interfaces'

export async function createKeyword(keyword: Keywords): Promise<Keywords> {
	try {
		keyword.keyword = keyword.keyword.substring(0, 150).toLocaleUpperCase()

		const id = await sql<{ id: number }[]>`
					INSERT INTO keyword_flags
					(keyword, reason)
					VALUES
					(${keyword.keyword}, ${keyword.reason}) RETURNING id;
				`

		keyword.id = await id[0].id

		return keyword
	} catch (e) {
		console.log(e)
		throw e
	}
}
