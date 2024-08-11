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
import Information from './Information'
import { QueryParams } from '../reviews/review'

export interface ILocationType {
	longitude: number
	latitude: number
	id: number
	name: string
	value: string
}

interface IProps {
	setSelectedIndex: (id: number) => void
	queryParams: QueryParams
	setQueryParams: (params: QueryParams) => void
}

const MapComponent = ({
	setSelectedIndex,
	queryParams,
	setQueryParams,
}: IProps) => {
	const { t } = useTranslation('reviews')
	const [usZipCodes, setUSZipCodes] = useState<Options[]>([])
	const [caPostalCodes, setCAPostalCodes] = useState<Options[]>([])
	const [country, setCountry] = useState<Options | null>(null)
	const [state, setState] = useState<Options | null>(null)
	const [dynamicStateOptions, setDynamicStateOptions] = useState<Options[]>([])
	const [selectedPoint, setSelectedPoint] = useState<ILocationType | null>(null)

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
			if (country.value === 'CA') {
				setCAPostalCodes(options.zips)
			} else if (country.value === 'US') {
				setUSZipCodes(options.zips)
			}
		} catch (error) {
			console.error('Error fetching zip codes:', error)
		}
	}

	// Trigger Fetching Zips whenever Country and State are selected/Changed
	useEffect(() => {
		if (country && state) {
			fetchZips(country, state)
		}
	}, [country, state])

	// Reset state to null when country changes
	useEffect(() => {
		setState(null)
	}, [country])

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

	const caLocations = useMemo(() => {
		if (country?.value === 'CA' && state?.value) {
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
						setSelectedIndex={setSelectedIndex}
						queryParams={queryParams}
						setQueryParams={setQueryParams}
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
					style={{ width: '100%', height: 800 }}
					mapStyle='mapbox://styles/mapbox/streets-v9'
					onMove={(evt) => setViewState(evt.viewState)}
				>
					{country.name === 'United States' &&
						usLocations.map(
							(location) =>
								location?.latitude &&
								location.longitude && (
									<Marker
										key={location.value}
										longitude={location.longitude}
										latitude={location.latitude}
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
					{country.name === 'Canada' &&
						caLocations.map(
							(location) =>
								location?.latitude &&
								location.longitude && (
									<Marker
										key={location.value}
										longitude={location.longitude}
										latitude={location.latitude}
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
