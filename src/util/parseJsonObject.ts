export async function parseJsonObject(
	request: Request,
): Promise<Record<string, unknown> | null> {
	try {
		const body: unknown = await request.json()

		if (typeof body !== 'object' || body === null || Array.isArray(body)) {
			return null
		}

		return body as Record<string, unknown>
	} catch {
		return null
	}
}
