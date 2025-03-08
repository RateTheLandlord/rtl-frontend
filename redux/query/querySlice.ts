import { sortOptions } from '@/util/helpers/filter-options'
import { Options, SortOptions } from '@/util/interfaces/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IQuery {
	selectedSort: SortOptions
	countryFilter: Options | null
	stateFilter: Options | null
	cityFilter: Options | null
	zipFilter: Options | null
	activeFilters: (Options | null)[] | null
	searchFilter: string | undefined
}

interface IStateAndCountry {
	state: Options | null
	country: Options | null
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
		updateActiveFilters(state, action: PayloadAction<(Options | null)[]>) {
			return { ...state, activeFilters: action.payload }
		},
		updateStateAndCountry(state, action: PayloadAction<IStateAndCountry>) {
			state.countryFilter = action.payload.country
			state.stateFilter = action.payload.state
		},
		clearReviewFilters(state) {
			return {
				...initialState,
				countryFilter: state.countryFilter,
				stateFilter: state.stateFilter,
			}
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
	updateState,
	updateZip,
	clearFilters,
	updateStateAndCountry,
	clearReviewFilters,
} = querySlice.actions
export default querySlice.reducer
