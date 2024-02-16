import { configureStore } from '@reduxjs/toolkit';
import {
	TypedUseSelectorHook,
	useDispatch,
	useSelector,
} from 'react-redux';
import {
	authReducer,
	loaderReducer,
	productsReducer,
	usersReducer,
} from './slices';

interface Store {
	auth: ReturnType<typeof authReducer>;
	loader: ReturnType<typeof loaderReducer>;
	products: ReturnType<typeof productsReducer>;
	users: ReturnType<typeof usersReducer>;
}

export const store = configureStore<Store>({
	reducer: {
		auth: authReducer,
		loader: loaderReducer,
		products: productsReducer,
		users: usersReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> =
	useSelector;
