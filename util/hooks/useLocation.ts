import { useCallback, useEffect, useState } from 'react'
import {
	ILocationHookResponse,
	ILocationResponse,
} from '@/util/interfaces/interfaces'
import { useDebounce } from './useDebounce'

export const useLocation = (input: string, country: string) => {
	const [locations, setLocations] = useState<ILocationHookResponse[]>([])
	const [searching, setSearching] = useState(false)

	const debouncedSearchString = useDebounce(input, 500)

	const searchLocations = useCallback(async () => {
		setSearching(true)
		fetch(
			`https://nominatim.openstreetmap.org/search?q=${input}&format=json&limit=5&addressdetails=1&countrycodes=${country}`,
		)
			.then((response) => {
				if (!response.ok) {
					throw new Error()
				}
				return response.json()
			})
			.then((data) => {
				const formattedData = formatData(data)
				setLocations(formattedData)
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {
				setSearching(false)
			})
	}, [input, country])

	useEffect(() => {
		if (debouncedSearchString) {
			searchLocations()
		}
	}, [debouncedSearchString, searchLocations])

	return { searching, locations }
}

const formatData = (data: ILocationResponse[]): ILocationHookResponse[] => {
	const newData: ILocationHookResponse[] = []
	for (let i = 0; i < data.length; i++) {
		if (data[i].address.city) {
			const existingCity = newData.some(
				(item) => item.city === data[i].address.city,
			)
			if (!existingCity) {
				newData.push({
					id: data[i].place_id,
					city: data[i].address.city,
					state: data[i].address.state,
				})
			}
		}
	}
	return newData
}
