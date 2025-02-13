import { sortOptions } from '@/util/helpers/filter-options'
import { Options, SortOptions } from '@/util/interfaces/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IQuery {
	selectedSort: SortOptions
	countryFilter: Options | null
	stateFilter: Options | null
	cityFilter: Options | null
	activeFilters: (Options | null)[] | null
	searchFilter: string | undefined
}

const initialState: IQuery = {
	selectedSort: sortOptions[2],
	countryFilter: null,
	stateFilter: null,
	cityFilter: null,
	activeFilters: null,
	searchFilter: '',
}

const resourceQuery = createSlice({
	name: 'resourceQuery',
	initialState,
	reducers: {
		updateResourceCountry(state, action: PayloadAction<Options | null>) {
			state.countryFilter = action.payload
		},
		updateResourceState(state, action: PayloadAction<Options | null>) {
			state.stateFilter = action.payload
		},
		updateResourceCity(state, action: PayloadAction<Options | null>) {
			state.cityFilter = action.payload
		},
		updateResourceSearch(state, action: PayloadAction<string | undefined>) {
			state.searchFilter = action.payload
		},
		updateResourceActiveFilters(
			state,
			action: PayloadAction<(Options | null)[]>,
		) {
			return { ...state, activeFilters: action.payload }
		},
		clearResourceFilters() {
			return { ...initialState }
		},
	},
})

export const {
	updateResourceCity,
	updateResourceCountry,
	updateResourceSearch,
	updateResourceState,
	updateResourceActiveFilters,
	clearResourceFilters,
} = resourceQuery.actions
export default resourceQuery.reducer
