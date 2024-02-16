'use client';
import React, { Fragment } from 'react';
import { ProductType } from '../../../../types';
import { Dialog, Transition } from '@headlessui/react';
import {
	MinusIcon,
	PlusIcon,
	TrashIcon,
} from '@heroicons/react/24/outline';

export type ProductProps = {
	product: ProductType | null;
	amount: number;
	close: () => void;
	update: (product: string, amount: number) => void;
};

export type ProductState = {
	counter: number;
};

const Product: React.FC<ProductProps> = ({
	amount,
	close,
	product,
	update,
}) => {
	const [counter, setCounter] = React.useState<
		ProductState['counter']
	>(amount !== 0 ? amount : 1);

	const handleIncrement = () => {
		setCounter(counter + 1);
	};

	const handleDecrement = () => {
		if (counter > 1) {
			setCounter(counter - 1);
		}
	};

	return (
		<Transition appear show={true} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-10'
				onClose={() => {
					setCounter(1);
					close();
				}}
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/25' />
				</Transition.Child>
				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel className='w-full max-w-md aspect-auto transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
								{product && (
									<>
										<Dialog.Title
											as='h3'
											className='text-2xl text-center font-medium leading-6 text-gray-900'
										>
											{product.name}
										</Dialog.Title>
										<div className='mt-6 flex items-center justify-center'>
											{counter > 1 ? (
												<figure className='w-11 bg-slate-100 aspect-square border border-slate-100 shadow-sm rounded-full flex items-center justify-center'>
													<button onClick={handleDecrement}>
														<MinusIcon className='w-5 h-5 text-slate-700' />
													</button>
												</figure>
											) : (
												<figure className='w-11 bg-rose-100 aspect-square border border-rose-100 shadow-sm rounded-full flex items-center justify-center'>
													<button
														onClick={() => {
															update(product._id, 0);
															setCounter(1);
														}}
													>
														<TrashIcon className='w-5 h-5 text-rose-600' />
													</button>
												</figure>
											)}

											<div className='w-40 aspect-square flex items-center justify-center'>
												<span className='text-9xl text-blue-900'>
													{counter}
												</span>
											</div>
											<figure className='w-11 bg-slate-100 aspect-square border border-slate-100 shadow-sm rounded-full flex items-center justify-center'>
												<button onClick={handleIncrement}>
													<PlusIcon className='w-5 h-5' />
												</button>
											</figure>
										</div>
										<div className='mt-6'>
											<button
												type='button'
												className='w-full inline-flex justify-center rounded-md border border-transparent bg-slate-200 px-4 py-3 font-medium text-slate-800'
												onClick={() => {
													update(product._id, counter);
													setCounter(1);
												}}
											>
												Guardar
											</button>
										</div>
									</>
								)}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default Product;
