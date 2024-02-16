'use client';
import React, { Fragment } from 'react';
import { ProductType, ReportType } from '../../types';
import { Menu, Transition } from '@headlessui/react';
import {
	ArrowLeftEndOnRectangleIcon,
	BanknotesIcon,
	QrCodeIcon,
	ShoppingBagIcon,
	ShoppingCartIcon,
	UserIcon,
} from '@heroicons/react/24/outline';
import {
	ShoppingBagIcon as ShoppingBagSolidIcon,
	ArrowLeftEndOnRectangleIcon as ArrowLeftEndOnRectangleSolidIcon,
} from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils';
import {
	RootState,
	useAppDispatch,
	useAppSelector,
} from '../../redux/store';
import {
	startLoading,
	stopLoading,
	clearCredentials,
} from '../../redux/slices';
import { createSale, getReport } from '../../api/services/sales';

export type HomeProps = {
	// types...
};

export type HomeState = {
	report: ReportType | null;
	products: ProductType[];
};

const Home: React.FC = () => {
	const [report, setReport] =
		React.useState<HomeState['report']>(null);

	const { products } = useAppSelector(
		(state: RootState) => state.products,
	);
	const { user } = useAppSelector((state: RootState) => state.auth);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleCreateSale = async () => {
		try {
			dispatch(startLoading());
			const { data: response } = await createSale();
			navigate(`/sales/${response.data._id}`);
		} catch (error) {
			console.error(error);
		} finally {
			dispatch(stopLoading());
		}
	};

	React.useEffect(() => {
		const fetchReport = async () => {
			try {
				dispatch(startLoading());
				const { data: response } = await getReport();
				setReport(response.data);
			} catch (error) {
				console.error(error);
			} finally {
				dispatch(stopLoading());
			}
		};

		fetchReport();
	}, [dispatch]);

	return (
		<div className='w-full h-full flex bg-slate-700  flex-col'>
			<div className='w-full p-4'>
				<header className='w-full flex items-center justify-between mb-4'>
					<Menu as='div' className='relative inline-block text-left'>
						<div>
							<Menu.Button className='flex items-center space-x-2'>
								<figure className='w-8 aspect-square bg-slate-400 border border-transparent rounded-full shadow-sm flex items-center justify-center'>
									<UserIcon className='w-4 h-4 text-slate-700' />
								</figure>
								<div className='text-left'>
									<h2 className='font-medium text-slate-100 leading-tight'>
										{user?.name}
									</h2>
									<p className='text-xs text-slate-500 leading-none'>
										{user?.role === 'user' ? 'Usuario' : 'Admin'}
									</p>
								</div>
							</Menu.Button>
						</div>
						<Transition
							as={Fragment}
							enter='transition ease-out duration-100'
							enterFrom='transform opacity-0 scale-95'
							enterTo='transform opacity-100 scale-100'
							leave='transition ease-in duration-75'
							leaveFrom='transform opacity-100 scale-100'
							leaveTo='transform opacity-0 scale-95'
						>
							<Menu.Items className='absolute left-0 mt-2 w-44 origin-top-right divide-y divide-slate-300 rounded-md bg-slate-100 shadow-lg ring-1 ring-black/5 focus:outline-none'>
								<div className='px-1 py-1 '>
									<Menu.Item>
										{({ active }) => (
											<Link
												to='/sales'
												className={`${
													active
														? 'bg-slate-500 text-salte-100'
														: 'text-slate-900'
												} group font-medium flex w-full items-center rounded-md px-2 py-2 text-sm`}
											>
												{active ? (
													<ShoppingBagSolidIcon
														className='mr-2 h-5 w-5'
														aria-hidden='true'
													/>
												) : (
													<ShoppingBagIcon
														className='mr-2 h-5 w-5'
														aria-hidden='true'
													/>
												)}
												Ventas
											</Link>
										)}
									</Menu.Item>
								</div>
								<div className='px-1 py-1 '>
									<Menu.Item>
										{({ active }) => (
											<button
												onClick={async () => {
													localStorage.removeItem('token');
													dispatch(clearCredentials());
													navigate('/login', { replace: true });
												}}
												className={`${
													active
														? 'bg-slate-500 text-salte-100'
														: 'text-slate-900'
												} group font-medium flex w-full items-center rounded-md px-2 py-2 text-sm`}
											>
												{active ? (
													<ArrowLeftEndOnRectangleSolidIcon
														className='mr-2 h-5 w-5'
														aria-hidden='true'
													/>
												) : (
													<ArrowLeftEndOnRectangleIcon
														className='mr-2 h-5 w-5'
														aria-hidden='true'
													/>
												)}
												Cerrar sesión
											</button>
										)}
									</Menu.Item>
								</div>
							</Menu.Items>
						</Transition>
					</Menu>
					{user?.role === 'user' && (
						<button
							onClick={handleCreateSale}
							className='h-8 bg-transparent border border-slate-400 rounded-full shadow-sm flex items-center justify-center text-slate-200 text-xs px-2.5'
						>
							<ShoppingCartIcon className='w-4 h-4 mr-2' /> Nueva
							venta
						</button>
					)}
				</header>
				<div className='w-full p-6 bg-slate-800 rounded-xl text-center mb-4'>
					<h1 className='text-4xl font-semibold text-slate-100'>
						{formatCurrency(report?.totalSales || 0)}
					</h1>
				</div>
				<div className='w-full flex items-center justify-around'>
					<div className='flex items-center space-x-2'>
						<figure className='w-8 aspect-square bg-slate-100 rounded-full flex items-center justify-center'>
							<BanknotesIcon className='w-4 h-4 text-slate-700' />
						</figure>
						<span className='leading-none text-slate-100'>
							{formatCurrency(
								report?.salesByPaymentMethod.find(
									(p) => p._id === 'cash',
								)?.total || 0,
							)}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<figure className='w-8 aspect-square bg-slate-100 rounded-full flex items-center justify-center'>
							<QrCodeIcon className='w-4 h-4 text-slate-700' />
						</figure>
						<span className='leading-none text-slate-100'>
							{formatCurrency(
								report?.salesByPaymentMethod.find(
									(p) => p._id === 'transfer',
								)?.total || 0,
							)}
						</span>
					</div>
				</div>
			</div>
			<div className='w-full flex-grow bg-slate-100 rounded-t-2xl p-4'>
				<h3 className='font-semibold text-lg text-slate-900 mb-2'>
					Productos vendidos
				</h3>
				<ul className='w-full flex flex-col space-y-1'>
					{products?.map((product) => (
						<li
							key={product._id}
							className='w-full px-4 py-1 border-b last:border-0 border-slate-200 rounded flex items-center justify-between'
						>
							<h2 className='font-medium text-slate-700'>
								{product.name}
							</h2>
							<span className='text-xs font-bold text-slate-800 bg-slate-400 px-1.5 aspect-square text-center rounded'>
								{report?.productsSold.find(
									(p) => p._id === product._id,
								)?.total || 0}
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Home;
