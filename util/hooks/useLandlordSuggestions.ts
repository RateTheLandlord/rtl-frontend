import { useEffect, useState } from 'react'
import { useDebounce } from './useDebounce'

export const useLandlordSuggestions = (landlord: string) => {
	const [landlordSuggestions, setLandlordSuggestions] = useState<string[]>([])
	const [isSearching, setIsSearching] = useState(false)

	const debouncedSearchString = useDebounce(landlord, 500)

	useEffect(() => {
		if (landlord) {
			setIsSearching(true)
			const fetchData = async () => {
				fetch('/api/review/get-landlord-suggestions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ input: landlord }),
				})
					.then((res) => {
						if (!res.ok) {
							throw new Error()
						}
						return res.json()
					})
					.then((data) => {
						setLandlordSuggestions(data)
					})
					.catch((err) => console.log(err))
					.finally(() => setIsSearching(false))
			}
			void fetchData()
		}
	}, [debouncedSearchString])

	return { isSearching, landlordSuggestions }
}
