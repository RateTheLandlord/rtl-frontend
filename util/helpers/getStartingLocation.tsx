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
	affiliate: string | null,
) => {
	if (affiliate && affiliate === 'stfx' && state.value === 'NOVA SCOTIA') {
		setViewState({
			longitude: -61.99546134654629,
			latitude: 45.61779097076272,
			zoom: 15,
		})
	} else if (state && country) {
		if (country.value === 'CA') {
			const location = caProvinceLocations[state.value]
			if (location) {
				setViewState({
					latitude: location.latitude,
					longitude: location.longitude,
					zoom: 6,
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
					zoom: 6,
				})
			} else {
				toast.error('Error getting location, using default location.')
			}
		} else {
			toast.error('Error getting location, using default location.')
		}
	}
}
