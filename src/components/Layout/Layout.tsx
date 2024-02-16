'use client';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
	RootState,
	useAppDispatch,
	useAppSelector,
} from '../../redux/store';
import { Loader } from '../Loader';
import { getProducts, getUsers, me } from '../../api/services';
import {
	setCredentials,
	setProducts,
	setUsers,
	startLoading,
	stopLoading,
} from '../../redux/slices';

export type LayoutProps = {
	// types...
};

const Layout: React.FC = () => {
	const { loading } = useAppSelector(
		(state: RootState) => state.loader,
	);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const init = async () => {
			try {
				dispatch(startLoading());

				const [products, users] = await Promise.all([
					getProducts(),
					getUsers(),
				]);

				dispatch(setUsers(users.data));
				dispatch(setProducts(products.data));

				const token = localStorage.getItem('token');
				if (token) {
					const response = await me();
					dispatch(setCredentials({ user: response.data, token }));
				}
			} catch (error) {
				console.error(error);
			} finally {
				dispatch(stopLoading());
			}
		};

		init();
	}, [dispatch]);

	return (
		<div className='w-full h-lvh min-h-lvh relative overflow-hidden bg-slate-300 container mx-auto flex items-center justify-center'>
			<Loader open={loading} />
			<Outlet />
		</div>
	);
};

export default Layout;
