import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'
import { Options } from '@/util/interfaces/interfaces'
import { useEffect, useState } from 'react'
import { Map as MapView, Marker } from 'react-map-gl'
import SelectList from '../reviews/ui/select-list'
import { countryOptions } from '@/util/helpers/getCountryCodes'
import { useTranslation } from 'react-i18next'
import ComboBox from '../reviews/ui/combobox'
import CustomMarker from './CustomMarker'
import { getStartingLocation } from '@/util/helpers/getStartingLocation'
import Information from './Information'
import { IZipLocations } from '@/lib/location/location'

export interface ILocationType {
	longitude: number
	latitude: number
	id: number
	name: string
	value: string
}

const MapComponent = () => {
	const { t } = useTranslation('reviews')
	const [zipCodes, setZipCodes] = useState<Options[]>([])
	const [country, setCountry] = useState<Options | null>(null)
	const [state, setState] = useState<Options | null>(null)
	const [dynamicStateOptions, setDynamicStateOptions] = useState<Options[]>([])
	const [selectedPoint, setSelectedPoint] = useState<IZipLocations | null>(null)
	const [locations, setLocations] = useState<Array<IZipLocations>>([])

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
		try {
			const options = await fetchFilterOptions(
				country.value,
				state.value,
				'',
				'',
			)
			setZipCodes(options.zips)
		} catch (error) {
			console.error('Error fetching zip codes:', error)
		}
	}

	useEffect(() => {
		const getLocations = async () => {
			fetch('/api/location/get-location', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					zipCodes: zipCodes,
					country_code: country?.value,
				}),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error()
					}
					return res.json()
				})
				.then((data) => setLocations(data))
				.catch((err) => console.log(err))
		}
		if (zipCodes) {
			getLocations()
		}
	}, [zipCodes])

	// Trigger Fetching Zips whenever Country and State are selected/Changed
	useEffect(() => {
		if (country && state) {
			fetchZips(country, state)
		}
	}, [country, state])

	// Reset state to null when country changes
	useEffect(() => {
		setState(null)
		setSelectedPoint(null)
	}, [country])

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
			{/* Filter Options */}
			<div className='basis-1/5'>
				<div className='py-2'>
					<SelectList
						state={country}
						setState={setCountry}
						options={countryOptions}
						name={t('reviews.country')}
					/>
				</div>
				<div className='py-2'>
					<ComboBox
						state={state}
						setState={setState}
						options={dynamicStateOptions}
						name={t('reviews.state')}
					/>
				</div>
				{selectedPoint && (
					<Information
						selectedPoint={selectedPoint}
						country={country}
						state={state}
					/>
				)}
			</div>

			{/* Fallback if Country Selected is not Canada or the USA */}
			{country &&
				country.name !== 'Canada' &&
				country.name !== 'United States' && (
					<div className='mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center p-6'>
						<h1 className='mt-4 text-2xl text-gray-900 sm:text-5xl'>
							Not Available
						</h1>
						<p className='mt-6 text-base leading-7 text-gray-600'>
							Sorry, this country is not available for maps yet. Check back
							soon!
						</p>
					</div>
				)}

			{/* Prompt to select a Country */}
			{!state && !country && (
				<div className='mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center p-6'>
					<h1 className='mt-4 text-2xl text-gray-900 sm:text-5xl'>
						Please select a Country
					</h1>
				</div>
			)}

			{/* Prompt to select a Province / State */}
			{!state && country && (
				<div className='mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center p-6'>
					<h1 className='mt-4 text-2xl text-gray-900 sm:text-5xl'>
						Please select a Province / State
					</h1>
				</div>
			)}

			{/* Map View */}
			{state && country && (
				<MapView
					{...viewState}
					reuseMaps
					mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string}
					style={{ width: '100%', aspectRatio: '1 / 1' }}
					mapStyle='mapbox://styles/mapbox/streets-v9'
					onMove={(evt) => setViewState(evt.viewState)}
				>
					{locations.map(
						(location) =>
							location?.latitude &&
							location.longitude && (
								<Marker
									key={location.zip}
									longitude={Number(location.longitude)}
									latitude={Number(location.latitude)}
									anchor='bottom'
								>
									<CustomMarker
										selectedPoint={selectedPoint}
										setSelectedPoint={setSelectedPoint}
										location={location}
									/>
								</Marker>
							),
					)}
				</MapView>
			)}
		</div>
	)
}

export default MapComponent
