'use client';
import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

export type LoaderProps = {
	open: boolean;
};

const Loader: React.FC<LoaderProps> = ({ open }) => {
	return (
		<Transition appear show={open} as={Fragment}>
			<div className='relative z-50'>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 backdrop-blur-sm bg-slate-400/50' />
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
							<span className='loader' />
						</Transition.Child>
					</div>
				</div>
			</div>
		</Transition>
	);
};

export default Loader;
