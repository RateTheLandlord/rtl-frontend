import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IAlert {
	success: boolean
	open: boolean
}

const initialState: IAlert = {
	open: false,
	success: true,
}

const alertSlice = createSlice({
	name: 'alert',
	initialState,
	reducers: {
		updateAlertSuccess(state, action: PayloadAction<boolean>) {
			state.success = action.payload
		},
		updateAlertOpen(state, action: PayloadAction<boolean>) {
			state.open = action.payload
		},
	},
})

export const { updateAlertOpen, updateAlertSuccess } = alertSlice.actions
export default alertSlice.reducer
