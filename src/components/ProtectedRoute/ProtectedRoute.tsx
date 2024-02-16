'use client';
import React from 'react';
import { RootState, useAppSelector } from '../../redux/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export type ProtectedRouteProps = {
	// types...
};

const ProtectedRoute: React.FC = () => {
	const { user } = useAppSelector((state: RootState) => state.auth);
	const location = useLocation();

	if (user === null) {
		return (
			<Navigate to={'/login'} state={{ from: location.pathname }} />
		);
	} else {
		return <Outlet />;
	}
};

export default ProtectedRoute;
