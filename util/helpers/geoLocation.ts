import { toast } from 'react-toastify'

export const isGeolocationAvailable = () => {
	return 'geolocation' in navigator
}

export const getUserLocation = (
	setViewState: ({
		latitude,
		longitude,
		zoom,
	}: {
		latitude: number
		longitude: number
		zoom
	}) => void,
) => {
	if (isGeolocationAvailable()) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords
				setViewState({ latitude, longitude, zoom: 10 })
			},
			(error) => {
				console.error(`Geolocation Error: ${error.message}`)
				toast.error('Error getting location, using default location.')
			},
			{
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0,
			},
		)
	} else {
		console.error('Geolocation not supported by this browser')
		toast.error('Error getting location, using default location.')
	}
}
