'use client';
import React from 'react';
import { SaleType } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Sale } from './components';
import { useAppDispatch } from '../../redux/store';
import { startLoading, stopLoading } from '../../redux/slices';
import { getSales } from '../../api/services/sales';

export type SalesProps = {
	// types...
};

export type SalesState = {
	sales: SaleType[];
};

const Sales: React.FC = () => {
	const [sales, setSales] = React.useState<SalesState['sales']>();

	const dispatch = useAppDispatch();

	React.useEffect(() => {
		const fetchSales = async () => {
			try {
				dispatch(startLoading());
				const { data: response } = await getSales();
				setSales(response.data);
			} catch (error) {
				console.error(error);
			} finally {
				dispatch(stopLoading());
			}
		};

		fetchSales();
	}, [dispatch]);

	return (
		<div className='w-full h-full flex flex-col bg-slate-200 p-4 pt-20 relative'>
			<header className='w-full flex items-center justify-between p-6 pb-8 fixed left-0 top-0'>
				<Link to={'/'}>
					<figure className='h-8 border border-slate-800 rounded-full flex items-center justify-center text-slate-800 text-xs px-2.5'>
						<ArrowLeftIcon className='w-4 h-4 mr-2' /> Volver
					</figure>
				</Link>
				<h2 className='font-bold text-slate-800 text-xl'>Ventas</h2>
			</header>
			<div className='w-full flex-grow space-y-1 overflow-auto pb-2'>
				{sales &&
					sales.map((sale) => <Sale key={sale._id} sale={sale} />)}
			</div>
		</div>
	);
};

export default Sales;
