import { fetchFilterOptions } from '@/util/helpers/fetchFilterOptions'
import { Options } from '@/util/interfaces/interfaces'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Map as MapView, Marker } from 'react-map-gl/mapbox'
import CustomMarker from './CustomMarker'
import { getStartingLocation } from '@/util/helpers/getStartingLocation'
import Information from './Information'
import { IZipLocations } from '@/lib/location/types'
import { useRouter } from 'next/router'

interface MapProps {
	countryFilter: Options | null
	stateFilter: Options | null
}

const CANADA: Options = {
	id: 2,
	name: 'Canada',
	value: 'CA',
}

const NOVA_SCOTIA: Options = {
	id: 7,
	name: 'Nova Scotia',
	value: 'NOVA SCOTIA',
}

const MapComponent = ({ countryFilter, stateFilter }: MapProps) => {
	const router = useRouter()
	const { affiliate } = router.query

	const isStfxAffiliate = affiliate === 'stfx'

	const [country, setCountry] = useState<Options | null>(countryFilter)
	const [state, setState] = useState<Options | null>(stateFilter)
	const [zipCodes, setZipCodes] = useState<Options[]>([])
	const [locations, setLocations] = useState<IZipLocations[]>([])
	const [selectedPoint, setSelectedPoint] = useState<IZipLocations | null>(null)
	const [currAffiliate, setCurrAffiliate] = useState<string | null>(null)

	const [viewState, setViewState] = useState({
		longitude: -79.382,
		latitude: 43.654,
		zoom: 10,
	})

	// Track asynchronous requests to prevent stale responses.
	const zipRequestRef = useRef(0)
	const locationRequestRef = useRef(0)

	// Synchronize filters with parent props unless an affiliate overrides them.
	useEffect(() => {
		if (!router.isReady) return

		if (isStfxAffiliate) {
			setCountry(CANADA)
			setState(NOVA_SCOTIA)
			setCurrAffiliate('stfx')
		} else {
			setCountry(countryFilter)
			setState(stateFilter)
			setCurrAffiliate(null)
		}

		setSelectedPoint(null)
	}, [router.isReady, isStfxAffiliate, countryFilter, stateFilter])

	// Update the map's starting location when the filters or affiliate change.
	useEffect(() => {
		if (country && state) {
			getStartingLocation(setViewState, country, state, currAffiliate)
		}
	}, [country, state, currAffiliate])

	// Fetch ZIP codes whenever the country or state changes.
	useEffect(() => {
		const requestId = ++zipRequestRef.current

		setZipCodes([])
		setLocations([])
		setSelectedPoint(null)

		if (!country || !state) return

		const loadZips = async () => {
			try {
				const options = await fetchFilterOptions(
					country.value,
					state.value,
					'',
					'',
				)

				if (requestId !== zipRequestRef.current) return

				setZipCodes(options.zips)
			} catch (error) {
				if (requestId === zipRequestRef.current) {
					console.error('Error fetching ZIP codes:', error)
				}
			}
		}

		void loadZips()

		return () => {
			zipRequestRef.current++
		}
	}, [country, state])

	// Fetch map locations whenever the ZIP codes change.
	useEffect(() => {
		const requestId = ++locationRequestRef.current

		setLocations([])

		if (!zipCodes.length || !country) return

		const loadLocations = async () => {
			try {
				const response = await fetch('/api/location/get-location', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						zipCodes,
						country_code: country.value,
					}),
				})

				if (!response.ok) {
					throw new Error(`Failed to fetch locations: ${response.status}`)
				}

				const data = (await response.json()) as IZipLocations[]

				if (requestId !== locationRequestRef.current) return

				setLocations(data)
			} catch (error) {
				if (requestId === locationRequestRef.current) {
					console.error('Error fetching locations:', error)
				}
			}
		}

		void loadLocations()

		return () => {
			locationRequestRef.current++
		}
	}, [zipCodes, country])

	const updateSelectedPoint = useCallback((point: IZipLocations | null) => {
		setSelectedPoint(point)
	}, [])

	const isSupportedCountry =
		country?.name === 'Canada' || country?.name === 'United States'

	return (
		<div
			data-testid='map-component'
			className='divide divide-primary mt-2 flex flex-col gap-2 lg:flex-row'
		>
			{/* Selected location information */}
			<div className='basis-1/5'>
				{selectedPoint && (
					<Information
						selectedPoint={selectedPoint}
						country={country}
						state={state}
					/>
				)}
			</div>

			{/* Unsupported country fallback */}
			{country && !isSupportedCountry && (
				<div className='mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center p-6'>
					<h1 className='mt-4 text-2xl text-gray-900 sm:text-5xl'>
						Not Available
					</h1>
					<p className='mt-6 text-base leading-7 text-gray-600'>
						Sorry, this country is not available for maps yet. Check back soon!
					</p>
				</div>
			)}

			{/* Map */}
			{country && state && isSupportedCountry && (
				<MapView
					{...viewState}
					reuseMaps
					mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
					style={{
						width: '100%',
						aspectRatio: '1 / 1',
					}}
					mapStyle='mapbox://styles/mapbox/streets-v12'
					onMove={(evt) => setViewState(evt.viewState)}
				>
					{locations.map((location) => {
						const latitude = Number(location.latitude)
						const longitude = Number(location.longitude)

						if (
							location.latitude == null ||
							location.longitude == null ||
							!Number.isFinite(latitude) ||
							!Number.isFinite(longitude)
						) {
							return null
						}

						return (
							<Marker
								key={location.zip}
								longitude={longitude}
								latitude={latitude}
								anchor='bottom'
							>
								<CustomMarker
									selectedPoint={selectedPoint}
									setSelectedPoint={updateSelectedPoint}
									location={location}
								/>
							</Marker>
						)
					})}
				</MapView>
			)}
		</div>
	)
}

export default MapComponent
