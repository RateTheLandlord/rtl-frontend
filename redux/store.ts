import { configureStore } from '@reduxjs/toolkit'
import queryReducer from './query/querySlice'
import resourceQueryReducer from './resourceQuery/resourceQuerySlice'
import reviewReducer from './review/reviewSlice'
import resourceReducer from './resource/resourceSlice'

export const store = configureStore({
	reducer: {
		query: queryReducer,
		resourceQuery: resourceQueryReducer,
		review: reviewReducer,
		resource: resourceReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
