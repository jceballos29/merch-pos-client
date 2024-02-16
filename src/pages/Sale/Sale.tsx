'use client';
import React from 'react';
import { ProductType, SaleProductType, SaleType } from '../../types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
	ArrowLeftIcon,
	ArrowLongRightIcon,
	BanknotesIcon,
	QrCodeIcon,
	TrashIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils';
import { Product } from './components';
import {
	useAppSelector,
	RootState,
	useAppDispatch,
} from '../../redux/store';
import { startLoading, stopLoading } from '../../redux/slices';
import { getSale, updateSale } from '../../api/services/sales';

export type SaleProps = {
	// types...
};

export type SaleState = {
	sale: SaleType | null;
	saleProducts: SaleProductType[];
	products: ProductType[];
	paymentMethod: 'cash' | 'transfer';
	selected: {
		product: ProductType | null;
		amount: number;
		open: boolean;
	};
};

const Sale: React.FC = () => {
	const [sale, setSale] = React.useState<SaleState['sale']>(null);
	const [saleProducts, setSaleProducts] = React.useState<
		SaleState['saleProducts']
	>([]);
	const [paymentMethod, setPaymentMethod] =
		React.useState<SaleState['paymentMethod']>('cash');
	const [selected, setSelected] = React.useState<
		SaleState['selected']
	>({
		product: null,
		amount: 0,
		open: false,
	});

	const { products } = useAppSelector(
		(state: RootState) => state.products,
	);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const params = useParams<{ id: string }>();

	const handleCancelSale = async () => {
		try {
			dispatch(startLoading());
			if (params.id) {
				const { data: response } = await updateSale(params.id, {
					state: 'canceled',
				});
				setSale(response.data);
				navigate('/', { replace: true });
			}
		} catch (error) {
			console.error(error);
		} finally {
			dispatch(stopLoading());
		}
	};

	const handleCompleteSale = async () => {
		try {
			dispatch(startLoading());
			const total = saleProducts.reduce((acc, saleProduct) => {
				const product = products.find(
					(product) => product._id === saleProduct.product,
				);
				return acc + (product?.price || 0) * saleProduct.amount;
			}, 0);
			if (params.id) {
				const { data: response } = await updateSale(params.id, {
					state: 'completed',
					products: saleProducts,
					total,
					paymentMethod,
				});
				setSale(response.data);
				navigate('/', { replace: true });
			}
		} catch (error) {
			console.error(error);
		} finally {
			dispatch(stopLoading());
		}
	};

	const handleUpdateProductsSale = (id: string, amount: number) => {
		setSaleProducts((prev) => {
			const index = prev.findIndex(
				(saleProduct) => saleProduct.product === id,
			);
			if (index === -1) {
				return [...prev, { product: id, amount }];
			}
			if (amount === 0) {
				return prev.filter(
					(saleProduct) => saleProduct.product !== id,
				);
			}
			prev[index].amount = amount;
			return prev;
		});
	};

	React.useEffect(() => {
		const fetchSale = async () => {
			try {
				dispatch(startLoading());
				if (params.id) {
					const { data: response } = await getSale(params.id);
					setSale(response.data);

					if (
						response.data.state === 'completed' ||
						response.data.state === 'cancelled'
					) {
						setSaleProducts(
							response.data.products.map((p: SaleProductType) => ({
								product: p.product,
								amount: p.amount,
							})),
						);
						setPaymentMethod(response.data.paymentMethod);
					}
				}
			} catch (error) {
				console.error(error);
			} finally {
				dispatch(stopLoading());
			}
		};

		fetchSale();
	}, [dispatch, params.id]);

	return (
		<div className='select-none w-full h-full flex flex-col bg-slate-200 p-4 relative'>
			{selected.open && (
				<Product
					product={selected.product}
					amount={selected.amount}
					update={(product: string, amount: number) => {
						handleUpdateProductsSale(product, amount);
						setSelected({
							product: null,
							amount: 0,
							open: false,
						});
					}}
					close={() => {
						setSelected({
							product: null,
							amount: 0,
							open: false,
						});
					}}
				/>
			)}
			<header className='w-full flex items-center justify-between mb-4'>
				{sale?.state === 'processing' ? (
					<button onClick={handleCancelSale}>
						<figure className='h-8 bg-rose-100 aspect-square border border-rose-100 shadow-sm rounded-full flex items-center justify-center text-rose-600 text-sm'>
							<TrashIcon className='w-4 h-4' />
						</figure>
					</button>
				) : (
					<Link to={'/sales'}>
						<figure className='h-8 aspect-square border border-slate-800 rounded-full flex items-center justify-center text-slate-800 text-sm'>
							<ArrowLeftIcon className='w-4 h-4' />
						</figure>
					</Link>
				)}
				<h2 className='h-8 font-bold text-slate-800 text-xl leading-none flex items-center justify-center'>
					Venta {sale?.number || 0}
				</h2>
			</header>
			<ul className='w-full space-y-1'>
				{products.map((product: ProductType) => (
					<li
						onClick={() => {
							console.log(
								saleProducts.find(
									(item: SaleProductType) =>
										item.product === product._id,
								)?.amount,
							);
							if (sale?.state === 'processing') {
								setSelected({
									product,
									amount:
										saleProducts.find(
											(item: SaleProductType) =>
												item.product === product._id,
										)?.amount || 0,
									open: true,
								});
							}
						}}
						key={product._id}
						className='w-full h-10 px-2 py-1 border border-slate-200 shadow-sm rounded-lg flex items-center justify-between bg-slate-100 select-none'
					>
						<h2 className='font-bold text-base text-slate-800 leading-tight'>
							{product.name}
						</h2>
						<span className='ml-auto mr-2 text-xs text-slate-500 text-center leading-tight'>
							{formatCurrency(product.price)}
						</span>
						<figure className=' h-6 aspect-square bg-slate-300 rounded  flex items-center justify-center '>
							<span className='text-sm font-bold text-slate-600'>
								{saleProducts.find(
									(item: SaleProductType) =>
										item.product === product._id,
								)?.amount || 0}
							</span>
						</figure>
					</li>
				))}
			</ul>
			<div className='mt-auto'>
				<div className='w-full mb-2 flex items-center justify-between gap-2'>
					{sale?.state === 'processing' ? (
						<>
							<button
								onClick={() => {
									if (sale.state === 'processing')
										setPaymentMethod('cash');
								}}
								className={`flex-1 text-sm border flex items-center justify-start gap-2 p-4 h-10 rounded-lg transition-all ${
									paymentMethod === 'cash'
										? 'bg-slate-100 shadow text-slate-800 font-bold border-transparent'
										: 'bg-slate-200 text-slate-500 border-slate-500'
								}`}
							>
								<BanknotesIcon className='w-4 h-4' />
								Efectivo
							</button>
							<button
								onClick={() => {
									if (sale.state === 'processing')
										setPaymentMethod('transfer');
								}}
								className={`flex-1 text-sm border flex items-center justify-start gap-2 p-4 h-10 rounded-lg transition-all ${
									paymentMethod === 'transfer'
										? 'bg-slate-100 shadow text-slate-800 font-bold border-transparent'
										: 'bg-slate-200 text-slate-500 border-slate-500'
								}`}
							>
								<QrCodeIcon className='w-5 h-5' />
								Transferencia
							</button>
						</>
					) : (
						<>
							<span className='border flex items-center justify-start gap-2 p-4 h-14 rounded-lg transition-all bg-slate-100 shadow text-slate-800 font-bold border-transparent'>
								<BanknotesIcon className='w-6 h-6' />
								{paymentMethod === 'cash'
									? 'Efectivo'
									: 'Transferencia'}
							</span>
							{/* Total */}
							<p className='w-full h-14 flex items-center justify-between font-bold text-2xl'>
								<span>Total</span>
								{formatCurrency(
									saleProducts.reduce((acc, saleProduct) => {
										const product = products.find(
											(product) =>
												product._id === saleProduct.product,
										);
										return (
											acc + (product?.price || 0) * saleProduct.amount
										);
									}, 0),
								)}
							</p>
						</>
					)}
				</div>
				<button
					onClick={handleCompleteSale}
					disabled={
						sale?.state !== 'processing' || !saleProducts.length
					}
					className={`w-full h-14 shadow ${
						sale?.state === 'processing'
							? 'bg-emerald-600'
							: sale?.state === 'completed'
							? 'bg-slate-600'
							: 'bg-rose-600'
					} text-slate-100 font-bold text-lg px-4 py-3 rounded-lg`}
				>
					{sale?.state === 'processing' && (
						<div className='w-full flex items-center justify-between'>
							<span className='text-base font-normal flex items-center gap-2'>
								Total
								<span className='font-light text-slate-300'>
									{saleProducts.reduce((acc, saleProduct) => {
										return acc + saleProduct.amount;
									}, 0)}{' '}
									items
								</span>
							</span>
							<span className='font-medium text-base flex items-center gap-2'>
								{formatCurrency(
									saleProducts.reduce((acc, saleProduct) => {
										const product = products.find(
											(product) =>
												product._id === saleProduct.product,
										);
										return (
											acc + (product?.price || 0) * saleProduct.amount
										);
									}, 0),
								)}
								<ArrowLongRightIcon className='w-5 h-5 font-medium text-slate-300' />
							</span>
						</div>
					)}
					{sale?.state === 'completed' && 'Completada'}
					{sale?.state === 'canceled' && 'Cancelada'}
				</button>
			</div>
		</div>
	);
};

export default Sale;
