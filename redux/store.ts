import { configureStore } from '@reduxjs/toolkit'
import queryReducer from './query/querySlice'
import resourceQueryReducer from './resourceQuery/resourceQuerySlice'

export const store = configureStore({
	reducer: {
		query: queryReducer,
		resourceQuery: resourceQueryReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
