import { Country } from '@/types/review.types'
import { Resource } from '@/util/interfaces/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: Resource = {
	id: 0,
	date_added: new Date(),
	name: '',
	country_code: Country.CA,
	city: '',
	state: '',
	address: '',
	phone_number: '',
	description: '',
	href: '',
}

const reviewSlice = createSlice({
	name: 'review',
	initialState,
	reducers: {
		updateName(state, action: PayloadAction<string>) {
			state.name = action.payload
		},
		updateCountry(state, action: PayloadAction<Country>) {
			state.country_code = action.payload
		},
		updateCity(state, action: PayloadAction<string>) {
			state.city = action.payload
		},
		updateState(state, action: PayloadAction<string>) {
			state.state = action.payload
		},
		updateAddress(state, action: PayloadAction<string>) {
			state.address = action.payload
		},
		updatePhone(state, action: PayloadAction<string>) {
			state.phone_number = action.payload
		},
		updateDescription(state, action: PayloadAction<string>) {
			state.description = action.payload
		},
		updateHref(state, action: PayloadAction<string>) {
			state.href = action.payload
		},
		resetResource() {
			return initialState
		},
		updateResource(state, action: PayloadAction<Resource>) {
			return action.payload
		},
	},
})

export const {
	updateCity,
	updateCountry,
	updateName,
	updateState,
	resetResource,
	updateAddress,
	updateDescription,
	updateHref,
	updatePhone,
	updateResource,
} = reviewSlice.actions
export default reviewSlice.reducer
