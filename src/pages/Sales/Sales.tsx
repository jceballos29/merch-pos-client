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
		<div className='w-full h-full flex flex-col bg-slate-200 p-6 pt-24 relative'>
			<header className='w-full flex items-center justify-between p-6 pb-8 fixed left-0 top-0'>
				<Link to={'/'}>
					<figure className='h-11 aspect-square border border-slate-800 rounded-full flex items-center justify-center text-slate-800 text-sm'>
						<ArrowLeftIcon className='w-5 h-5' />
					</figure>
				</Link>
				<h2 className='font-bold text-slate-800 text-3xl'>Ventas</h2>
			</header>
			<div className='w-full flex-grow space-y-2 overflow-auto pb-2'>
				{sales &&
					sales.map((sale) => <Sale key={sale._id} sale={sale} />)}
			</div>
		</div>
	);
};

export default Sales;