import { getLandlordSuggestions } from '@/lib/review/landlords'
import { handleCorsPreflight, withCors } from '@/util/routeHandlerCors'

export const removeSpecialChars = (input: string) => {
	const specialCharsRegex = /[/@#$%^*<>?[\]{}|]/g
	return input.replace(specialCharsRegex, '')
}

export function OPTIONS(request: Request) {
	return handleCorsPreflight(request)!
}

export async function POST(request: Request) {
	const { input } = (await request.json()) as { input: string }
	const landlords = await getLandlordSuggestions(removeSpecialChars(input))
	return withCors(request, Response.json(landlords))
}
