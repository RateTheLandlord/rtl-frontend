import { Candidate } from '@/components/admin/sections/MergeDuplicateLandlords'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type LandlordState = {
	allLandlords: Candidate[]
	selectedLandlords: Candidate[]
	landlordName: string
}

const initialState: LandlordState = {
	allLandlords: [],
	selectedLandlords: [],
	landlordName: '',
}

const landlordSlice = createSlice({
	name: 'landlords',
	initialState,
	reducers: {
		updateLandlord(state, action: PayloadAction<Candidate>) {
			const index = state.selectedLandlords.findIndex(
				(item) => item.name === action.payload.name,
			)

			if (index >= 0) {
				state.selectedLandlords.splice(index, 1)
			} else {
				state.selectedLandlords.push(action.payload)
			}
		},
		updateAllLandlords(state, action: PayloadAction<Candidate[]>) {
			state.allLandlords = action.payload
		},
		updateLandlordName(state, action: PayloadAction<string>) {
			state.landlordName = action.payload.toLocaleUpperCase()
		},
		resetLandlords(state) {
			state.selectedLandlords = []
			state.allLandlords = []
		},
	},
})

export const {
	updateLandlord,
	resetLandlords,
	updateLandlordName,
	updateAllLandlords,
} = landlordSlice.actions
export default landlordSlice.reducer
