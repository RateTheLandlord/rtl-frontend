export const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const fetchWithBody = <T>(url: string, body: T) => {
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	}).then((res) => res.json())
}
