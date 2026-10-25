import { Country } from '@/types/review.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
	landlord: string
	country: Country
	city: string
	province: string
	postal: string
	rent: number | null
	repair: number
	health: number
	stability: number
	privacy: number
	respect: number
	review: string
}

const initialState: InitialState = {
	landlord: '',
	country: Country.CA,
	city: '',
	province: 'Alberta',
	postal: '',
	rent: null,
	repair: 3,
	health: 3,
	stability: 3,
	privacy: 3,
	respect: 3,
	review: '',
}

const reviewSlice = createSlice({
	name: 'review',
	initialState,
	reducers: {
		updateLandlord(state, action: PayloadAction<string>) {
			state.landlord = action.payload
		},
		updateCountry(state, action: PayloadAction<Country>) {
			state.country = action.payload
		},
		updateCity(state, action: PayloadAction<string>) {
			state.city = action.payload
		},
		updateProvince(state, action: PayloadAction<string>) {
			state.province = action.payload
		},
		updatePostal(state, action: PayloadAction<string>) {
			state.postal = action.payload
		},
		updateRent(state, action: PayloadAction<number | null>) {
			state.rent = action.payload
		},
		updateRepair(state, action: PayloadAction<number>) {
			state.repair = action.payload
		},
		updateHealth(state, action: PayloadAction<number>) {
			state.health = action.payload
		},
		updateStability(state, action: PayloadAction<number>) {
			state.stability = action.payload
		},
		updatePrivacy(state, action: PayloadAction<number>) {
			state.privacy = action.payload
		},
		updateRespect(state, action: PayloadAction<number>) {
			state.respect = action.payload
		},
		updateReview(state, action: PayloadAction<string>) {
			state.review = action.payload
		},
		resetReview() {
			return initialState
		},
	},
})

export const {
	updateCity,
	updateCountry,
	updateHealth,
	updateLandlord,
	updatePostal,
	updatePrivacy,
	updateProvince,
	updateRent,
	updateRepair,
	updateRespect,
	updateReview,
	updateStability,
	resetReview,
} = reviewSlice.actions
export default reviewSlice.reducer
