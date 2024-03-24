import { sortOptions } from '@/util/helpers/filter-options'
import { Options, SortOptions } from '@/util/interfaces/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IQuery {
	selectedSort: SortOptions
	countryFilter: Options | null
	stateFilter: Options | null
	cityFilter: Options | null
	zipFilter: Options | null
	activeFilters: Array<Options | null> | null
	searchFilter: string | undefined
}

const initialState: IQuery = {
	selectedSort: sortOptions[2],
	countryFilter: null,
	stateFilter: null,
	cityFilter: null,
	zipFilter: null,
	activeFilters: null,
	searchFilter: '',
}

const querySlice = createSlice({
	name: 'query',
	initialState,
	reducers: {
		updateSort(state, action: PayloadAction<SortOptions>) {
			state.selectedSort = action.payload
		},
		updateCountry(state, action: PayloadAction<Options | null>) {
			state.countryFilter = action.payload
		},
		updateState(state, action: PayloadAction<Options | null>) {
			state.stateFilter = action.payload
		},
		updateCity(state, action: PayloadAction<Options | null>) {
			state.cityFilter = action.payload
		},
		updateZip(state, action: PayloadAction<Options | null>) {
			state.zipFilter = action.payload
		},
		updateSearch(state, action: PayloadAction<string | undefined>) {
			state.searchFilter = action.payload
		},
		updateActiveFilters(state, action: PayloadAction<Array<Options | null>>) {
			return { ...state, activeFilters: action.payload }
		},
		clearFilters() {
			return { ...initialState }
		},
	},
})

export const {
	updateCity,
	updateCountry,
	updateSearch,
	updateSort,
	updateState,
	updateZip,
	updateActiveFilters,
	clearFilters,
} = querySlice.actions
export default querySlice.reducer
