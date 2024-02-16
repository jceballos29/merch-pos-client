'use client';
import React from 'react';
import { SaleType } from '../../../../types';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../../utils';

export type SaleProps = {
	sale: SaleType;
};

const Sale: React.FC<SaleProps> = ({ sale }) => {
	return (
		<Link
			to={`/sales/${sale._id}`}
			key={sale._id}
			className='w-full flex flex-col p-4 bg-slate-100 shadow-sm rounded-md'
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
				<span className='text-lg font-semibold text-slate-600'>
					{formatCurrency(sale.total)}
				</span>
			</div>
			<div className='flex items-center justify-between'>
				<h3 className='text-base font-bold text-slate-800'>
					N° {sale.number}
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
