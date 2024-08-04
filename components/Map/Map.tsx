import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'
import { Options } from '@/util/interfaces/interfaces'
import { useEffect, useMemo, useState } from 'react'
import { Map as MapView, Marker } from 'react-map-gl'
import SelectList from '../reviews/ui/select-list'
import { countryOptions } from '@/util/helpers/getCountryCodes'
import { useTranslation } from 'react-i18next'
import ComboBox from '../reviews/ui/combobox'
import CustomMarker from './CustomMarker'
import { provinceMaps, usLocationMap } from './locationMaps'
import { getStartingLocation } from '@/util/helpers/getStartingLocation'

const MapComponent = () => {
	const { t } = useTranslation('reviews')
	const [usZipCodes, setUSZipCodes] = useState<Options[]>([])
	const [caPostalCodes, setCAPostalCodes] = useState<Options[]>([])
	const [country, setCountry] = useState<Options | null>(null)
	const [state, setState] = useState<Options | null>(null)
	const [dynamicStateOptions, setDynamicStateOptions] = useState<Options[]>([])

	// Default location is Toronto, Ontario, Canada
	const [viewState, setViewState] = useState({
		longitude: -79.382,
		latitude: 43.654,
		zoom: 10,
	})

	useEffect(() => {
		if (country && state) {
			getStartingLocation(setViewState, country, state)
		}
	}, [country, state])

	// Get's Zips once a User has selected a Country and a State
	const fetchZips = async (country: Options, state: Options) => {
		if (country?.value === 'CA') {
			try {
				const caOptions = await fetchFilterOptions('CA', state?.value, '', '')
				setCAPostalCodes([...caOptions.zips])
			} catch (error) {
				console.error('Error fetching zip codes:', error)
			}
		} else if (country?.value === 'US') {
			try {
				const usOptions = await fetchFilterOptions('US', state?.value, '', '')
				setUSZipCodes([...usOptions.zips])
			} catch (error) {
				console.error('Error fetching zip codes:', error)
			}
		}
	}

	// Trigger Fetching Zips whenever Country and State are selected/Changed
	useEffect(() => {
		if (country && state) {
			fetchZips(country, state)
		}
	}, [country, state])

	// Pair Zips in our reviews with the location coordinates found in the json Maps
	const usLocations = useMemo(() => {
		return usZipCodes
			.map((location) => {
				const usLocation = usLocationMap.get(Number(location.value))
				if (usLocation) {
					return {
						...location,
						longitude: usLocation['ZipLongitude'],
						latitude: usLocation['ZipLatitude'],
					}
				}
				return null
			})
			.filter((location) => location !== null)
	}, [usZipCodes])

	// Pair Postal Codes in our reviews with the location coordinates found in the json Maps
	const caLocations = useMemo(() => {
		if (country?.value === 'CA' && state?.value) {
			console.log(state.value)
			const locationMap = provinceMaps[state.value]
			if (locationMap) {
				return caPostalCodes
					.map((location) => {
						const caLocation = locationMap.get(location.value)

						if (caLocation) {
							return {
								...location,
								longitude: Number(caLocation['LONGITUDE']),
								latitude: Number(caLocation['LATITUDE']),
							}
						}

						return null
					})
					.filter((location) => location !== null)
			}
		}
		return []
	}, [caPostalCodes, state, country])

	// Fetch Filter options for dropdown menu's
	const fetchDynamicFilterOptions = async () => {
		try {
			const filterOptions = await fetchFilterOptions(
				country?.value,
				state?.value,
				'',
				'',
			)
			setDynamicStateOptions(filterOptions.states)
		} catch (error) {
			console.error('Error fetching filter options:', error)
		}
	}

	// Update Filter options when a country is selected
	useEffect(() => {
		fetchDynamicFilterOptions()
	}, [country])

	return (
		<div className='divide mt-2 flex flex-col gap-2 divide-teal-600 lg:flex-row'>
			{/* Filter Options  */}
			<div className='basis-1/5'>
				<div className='py-2'>
					<SelectList
						state={country}
						setState={(opt: Options) => setCountry(opt)}
						options={countryOptions}
						name={t('reviews.country')}
					/>
				</div>
				<div className='py-2'>
					<ComboBox
						state={state}
						setState={(opt: Options) => setState(opt)}
						options={dynamicStateOptions}
						name={t('reviews.state')}
					/>
				</div>
			</div>
			{/* Fallback if Country Selected is not Canada or the USA - Needs Work */}
			{country &&
				country.name !== 'Canada' &&
				country.name !== 'United States' && (
					<p>Not Available in your country yet</p>
				)}
			{!state || !country ? (
				<p>Please select a Country and State / Province</p>
			) : null}
			{state && country && (
				<MapView
					{...viewState}
					reuseMaps
					mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string}
					style={{ width: '100%', height: 800 }}
					mapStyle='mapbox://styles/mapbox/streets-v9'
					onMove={(evt) => setViewState(evt.viewState)}
				>
					{country.name === 'United States' &&
						usLocations.map((location) => {
							if (location?.latitude && location.longitude) {
								return (
									<Marker
										key={location.value}
										longitude={location?.longitude}
										latitude={location?.latitude}
									/>
								)
							}
						})}
					{country.name === 'Canada' &&
						caLocations.map((location) => {
							if (location?.latitude && location.longitude) {
								return (
									<Marker
										key={location.value}
										longitude={location?.longitude}
										latitude={location?.latitude}
										anchor='bottom'
									>
										<CustomMarker
											location={location}
											country='CA'
											state={state.value}
										/>
									</Marker>
								)
							}
						})}
				</MapView>
			)}
		</div>
	)
}

export default MapComponent
