import { createSlice } from '@reduxjs/toolkit';
import { UserType } from '../../types';

export interface AuthState {
	user: UserType | null;
	token: string | null;
}

const initialState: AuthState = {
	user: null,
	token: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
		},
		clearCredentials: (state) => {
			state.user = null;
			state.token = null;
		},
	},
});

export const authReducer = authSlice.reducer;
export const { setCredentials, clearCredentials } = authSlice.actions;
