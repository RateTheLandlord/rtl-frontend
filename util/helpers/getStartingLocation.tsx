import { toast } from 'react-toastify'
import caProvinceLocations from '@/util/countries/ca-province-location.json'
import usStateLocations from '@/util/countries/us-state-location.json'
import { Options } from '../interfaces/interfaces'

export const getStartingLocation = (
	setViewState: ({
		latitude,
		longitude,
		zoom,
	}: {
		latitude: number
		longitude: number
		zoom: number
	}) => void,
	country: Options,
	state: Options,
) => {
	if (state && country) {
		if (country.value === 'CA') {
			const location = caProvinceLocations[state.value]
			if (location) {
				setViewState({
					latitude: location.latitude,
					longitude: location.longitude,
					zoom: 5,
				})
			} else {
				toast.error('Error getting location, using default location.')
			}
		} else if (country.value === 'US') {
			const location = usStateLocations[state.value]
			if (location) {
				setViewState({
					latitude: location.latitude,
					longitude: location.longitude,
					zoom: 5,
				})
			} else {
				toast.error('Error getting location, using default location.')
			}
		} else {
			toast.error('Error getting location, using default location.')
		}
	} else {
		toast.error('Error getting location, using default location.')
	}
}
