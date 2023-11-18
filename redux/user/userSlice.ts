import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IUsers {
	jwt: {
		access_token: string | undefined
	}
	result: {
		name: string | undefined
	}
}

const initialState: IUsers = {
	jwt: {
		access_token: undefined,
	},
	result: {
		name: undefined,
	},
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		updateUser(state, action: PayloadAction<IUsers>) {
			state.jwt = action.payload.jwt
			state.result = action.payload.result
		},
	},
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer
