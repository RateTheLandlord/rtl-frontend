import { configureStore } from '@reduxjs/toolkit'
import queryReducer from './query/querySlice'
import resourceQueryReducer from './resourceQuery/resourceQuerySlice'
import reviewReducer from './review/reviewSlice'
import resourceReducer from './resource/resourceSlice'
import landlordReducer from './landlord/landlordSlice'

export const store = configureStore({
	reducer: {
		query: queryReducer,
		resourceQuery: resourceQueryReducer,
		review: reviewReducer,
		resource: resourceReducer,
		landlord: landlordReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
