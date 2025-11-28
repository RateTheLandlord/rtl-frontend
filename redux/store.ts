import { configureStore } from '@reduxjs/toolkit'
import queryReducer from './query/querySlice'
import resourceQueryReducer from './resourceQuery/resourceQuerySlice'
import reviewReducer from './review/reviewSlice'
import resourceReducer from './resource/resourceSlice'
import modalReducer from './modal/modalSlice'

export const store = configureStore({
	reducer: {
		query: queryReducer,
		resourceQuery: resourceQueryReducer,
		review: reviewReducer,
		resource: resourceReducer,
		modal: modalReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
