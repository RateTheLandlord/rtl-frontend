export const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const fetchWithBody = <T, R>([url, body]: [string, T]): Promise<R> => {
	return fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Request failed with status ${res.status}`)
		}
		return res.json()
	})
}
