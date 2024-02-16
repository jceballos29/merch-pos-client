import { createSlice } from '@reduxjs/toolkit';
import { UserType } from '../../types';

export interface UsersState {
	users: UserType[];
}

const initialState: UsersState = {
	users: [],
};

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setUsers: (state, action) => {
			state.users = action.payload;
		},
	},
});

export const usersReducer = usersSlice.reducer;
export const { setUsers } = usersSlice.actions;
