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
import { useRouter } from 'next/router'

export interface ILocationType {
	longitude: number
	latitude: number
	id: number
	name: string
	value: string
}

const MapComponent = () => {
	const { t } = useTranslation('reviews')
	const router = useRouter()
	const { affiliate } = router.query

	// Consolidate related states
	const [formData, setFormData] = useState({
		zipCodes: [] as Options[],
		country: null as Options | null,
		state: null as Options | null,
		dynamicStateOptions: [] as Options[],
		selectedPoint: null as IZipLocations | null,
		locations: [] as IZipLocations[],
		currAffiliate: null as string | null,
		prevCountry: null as Options | null,
	})

	// Default location is Toronto, Ontario, Canada
	const [viewState, setViewState] = useState({
		longitude: -79.382,
		latitude: 43.654,
		zoom: 10,
	})

	useEffect(() => {
		if (formData.country && formData.state) {
			getStartingLocation(
				setViewState,
				formData.country,
				formData.state,
				formData.currAffiliate,
			)
		}
	}, [formData.country, formData.state, formData.currAffiliate])

	const fetchZips = async (country: Options, state: Options) => {
		try {
			const options = await fetchFilterOptions(
				country.value,
				state.value,
				'',
				'',
			)
			setFormData((prevData) => ({ ...prevData, zipCodes: options.zips }))
		} catch (error) {
			console.error('Error fetching zip codes:', error)
		}
	}

	useEffect(() => {
		if (formData.country && formData.state) {
			fetchZips(formData.country, formData.state)
		}
	}, [formData.country, formData.state])

	useEffect(() => {
		if (!formData.currAffiliate) {
			setFormData((prevData) => ({
				...prevData,
				state: null,
				selectedPoint: null,
			}))
		}
	}, [formData.currAffiliate])

	const fetchDynamicFilterOptions = async () => {
		try {
			const filterOptions = await fetchFilterOptions(
				formData.country?.value,
				formData.state?.value,
				'',
				'',
			)
			setFormData((prevData) => ({
				...prevData,
				dynamicStateOptions: filterOptions.states,
			}))
		} catch (error) {
			console.error('Error fetching filter options:', error)
		}
	}

	useEffect(() => {
		if (formData.prevCountry?.value !== formData.country?.value) {
			setFormData((prevData) => ({
				...prevData,
				state: null,
				currAffiliate: null,
				prevCountry: formData.country,
			}))
			fetchDynamicFilterOptions()
		} else {
			fetchDynamicFilterOptions()
		}
	}, [formData.country])

	useEffect(() => {
		if (router.isReady && affiliate === 'stfx') {
			setFormData({
				zipCodes: [],
				country: { id: 2, name: 'Canada', value: 'CA' },
				state: { id: 7, name: 'Nova Scotia', value: 'NOVA SCOTIA' },
				dynamicStateOptions: [],
				selectedPoint: null,
				locations: [],
				currAffiliate: 'stfx',
				prevCountry: { id: 2, name: 'Canada', value: 'CA' },
			})
		}
	}, [affiliate, router.isReady])

	useEffect(() => {
		if (formData.zipCodes.length > 0) {
			const getLocations = async () => {
				try {
					const res = await fetch('/api/location/get-location', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							zipCodes: formData.zipCodes,
							country_code: formData.country?.value,
						}),
					})
					if (!res.ok) throw new Error('Network response was not ok')
					const data = await res.json()
					setFormData((prevData) => ({ ...prevData, locations: data }))
				} catch (error) {
					console.error('Error fetching locations:', error)
				}
			}
			getLocations()
		}
	}, [formData.zipCodes])

	const updateCountry = (country: Options) => {
		setFormData((prevData) => ({ ...prevData, country: country }))
	}

	const updateState = (state: Options) => {
		setFormData((prevData) => ({ ...prevData, state: state }))
	}

	const updateSelectedPoint = (point: IZipLocations | null) => {
		setFormData((prevData) => ({ ...prevData, selectedPoint: point }))
	}

	return (
		<div className='divide mt-2 flex flex-col gap-2 divide-teal-600 lg:flex-row'>
			{/* Filter Options */}
			<div className='basis-1/5'>
				<div className='py-2'>
					<SelectList
						state={formData.country}
						setState={updateCountry}
						options={countryOptions}
						name={t('reviews.country')}
					/>
				</div>
				<div className='py-2'>
					<ComboBox
						state={formData.state}
						setState={updateState}
						options={formData.dynamicStateOptions}
						name={t('reviews.state')}
					/>
				</div>
				{formData.selectedPoint && (
					<Information
						selectedPoint={formData.selectedPoint}
						country={formData.country}
						state={formData.state}
					/>
				)}
			</div>

			{/* Fallback if Country Selected is not Canada or the USA */}
			{formData.country &&
				formData.country.name !== 'Canada' &&
				formData.country.name !== 'United States' && (
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
			{!formData.state && !formData.country && (
				<div className='mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center p-6'>
					<h1 className='mt-4 text-2xl text-gray-900 sm:text-5xl'>
						Please select a Country
					</h1>
				</div>
			)}

			{/* Prompt to select a Province / State */}
			{!formData.state &&
				formData.country &&
				(formData.country.name === 'Canada' ||
					formData.country.name === 'United States') && (
					<div className='mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center p-6'>
						<h1 className='mt-4 text-2xl text-gray-900 sm:text-5xl'>
							Please select a Province / State
						</h1>
					</div>
				)}

			{/* Map View */}
			{formData.state && formData.country && (
				<MapView
					{...viewState}
					reuseMaps
					mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string}
					style={{ width: '100%', aspectRatio: '1 / 1' }}
					mapStyle='mapbox://styles/mapbox/streets-v9'
					onMove={(evt) => setViewState(evt.viewState)}
				>
					{formData.locations.map(
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
										selectedPoint={formData.selectedPoint}
										setSelectedPoint={updateSelectedPoint}
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
