import fs from 'fs'
import path from 'path'

export const readLocaleFile = (
	fileName: string,
	locale: string,
): Record<string, unknown> => {
	try {
		const filePath = path.join(
			process.cwd(),
			'messages',
			locale,
			`${fileName}.json`,
		)
		return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<
			string,
			unknown
		>
	} catch (e) {
		console.error(e)
		return {} // Fallback if file doesn't exist
	}
}
