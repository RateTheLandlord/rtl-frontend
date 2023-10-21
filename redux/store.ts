import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import alertReducer from './alert/alertSlice'

export const store = configureStore({
	reducer: {
		user: userReducer,
		alert: alertReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
