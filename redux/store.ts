import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import alertReducer from './alert/alertSlice'
import queryReducer from './query/querySlice'
import resourceQueryReducer from './resourceQuery/resourceQuerySlice'

export const store = configureStore({
	reducer: {
		user: userReducer,
		alert: alertReducer,
		query: queryReducer,
		resourceQuery: resourceQueryReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
