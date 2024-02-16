'use client';
import React from 'react';
import { SaleType } from '../../../../types';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../../utils';
import { useAppSelector, RootState } from '../../../../redux/store';

export type SaleProps = {
	sale: SaleType;
};

const Sale: React.FC<SaleProps> = ({ sale }) => {
	const { user } = useAppSelector((state: RootState) => state.auth);
	const { users } = useAppSelector((state: RootState) => state.users);

	return (
		<Link
			to={`/sales/${sale._id}`}
			key={sale._id}
			className='w-full flex flex-col px-4 py-2 bg-slate-100 shadow-sm rounded-md'
		>
			<div className='flex items-center justify-between mb-1'>
				<span
					className={`text-xs leading-none px-1.5 py-1 rounded ${
						sale.state === 'completed'
							? 'bg-emerald-200 text-emerald-600'
							: sale.state === 'canceled'
							? 'bg-rose-200 text-rose-600'
							: 'bg-slate-200 text-slate-600'
					}`}
				>
					{sale.state === 'completed'
						? 'Completada'
						: sale.state === 'canceled'
						? 'Cancelada'
						: 'En proceso'}
				</span>
				<span className='text-base font-semibold text-slate-600'>
					{formatCurrency(sale.total)}
				</span>
			</div>
			<div className='flex items-center justify-between'>
				<h3 className='text-base font-bold text-slate-800 flex items-center gap-1'>
					N° {sale.number}{' '}
					{user?.role === 'admin' && (
						<span className='text-xs font-normal text-slate-400'>
							- {users?.find((user) => user._id === sale.user)?.name}
						</span>
					)}
				</h3>

				<span
					className={`text-xs leading-none px-1.5 py-1 rounded ${
						sale.paymentMethod === 'cash'
							? 'bg-amber-200 text-amber-600'
							: 'bg-sky-200 text-sky-600'
					}`}
				>
					{sale.paymentMethod === 'cash'
						? 'Efectivo'
						: 'Transferencia'}
				</span>
			</div>
		</Link>
	);
};

export default Sale;
