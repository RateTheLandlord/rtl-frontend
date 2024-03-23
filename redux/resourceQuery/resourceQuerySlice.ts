import { sortOptions } from '@/util/helpers/filter-options'
import { Options } from '@/util/interfaces/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IQuery {
	selectedSort: Options
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

const resourceQuery = createSlice({
	name: 'resourceQuery',
	initialState,
	reducers: {
		updateResourceQuery(state, action: PayloadAction<IQuery>) {
			const filters: Array<Options> = []
			if (action.payload.countryFilter) {
				filters.push(action.payload.countryFilter)
			}
			if (action.payload.stateFilter) {
				filters.push(action.payload.stateFilter)
			}
			if (action.payload.cityFilter) {
				filters.push(action.payload.cityFilter)
			}
			if (action.payload.zipFilter) {
				filters.push(action.payload.zipFilter)
			}
			return { ...action.payload, activeFilters: filters }
		},
	},
})

export const { updateResourceQuery } = resourceQuery.actions
export default resourceQuery.reducer
