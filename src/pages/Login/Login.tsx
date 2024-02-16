'use client';
import React, { Fragment } from 'react';
import { UserType } from '../../types';
import { Listbox, Transition } from '@headlessui/react';
import {
	CheckIcon,
	ChevronUpDownIcon,
} from '@heroicons/react/24/outline';
import {
	RootState,
	useAppDispatch,
	useAppSelector,
} from '../../redux/store';
import { login } from '../../api/services';
import { setCredentials } from '../../redux/slices';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export type LoginState = {
	users: UserType[];
	selected: UserType | null;
	loading: boolean;
};

const Login: React.FC = () => {
	const [selected, setSelected] =
		React.useState<LoginState['selected']>(null);
	const [loading, setLoading] =
		React.useState<LoginState['loading']>(false);

	const { users } = useAppSelector((state: RootState) => state.users);
	const { user } = useAppSelector((state: RootState) => state.auth);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogin = async () => {
		try {
			setLoading(true);
			if (selected) {
				const response = await login({
					email: selected.email,
					password: selected.email.split('@')[0].concat('123'),
				});
				const { token, user } = response.data;
				localStorage.setItem('token', token);
				dispatch(setCredentials({ user, token }));
				navigate('/', { replace: true });
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (user !== null) {
		const { from } = location.state || { from: { pathname: '/' } };
		return <Navigate to={from} replace />;
	}

	return (
		<div className='w-full h-full flex items-center bg-slate-700 justify-center p-6'>
			<div className='w-full max-w-md transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
				<Listbox value={selected} onChange={setSelected}>
					<div className='relative mt-1'>
						<Listbox.Button className='relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
							<span
								className={`block truncate ${
									selected ? 'text-slate-900' : 'text-slate-400'
								}`}
							>
								{selected?.name || 'Seleccione un usuario'}
							</span>
							<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
								<ChevronUpDownIcon
									className='h-5 w-5 text-gray-400'
									aria-hidden='true'
								/>
							</span>
						</Listbox.Button>
						<Transition
							as={Fragment}
							leave='transition ease-in duration-100'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
								{users.length &&
									users.map((user) => (
										<Listbox.Option
											key={user._id}
											className={({ active }) =>
												`relative cursor-default select-none py-2 pl-10 pr-4 ${
													active
														? 'bg-slate-100 text-slate-900'
														: 'text-slate-600'
												}`
											}
											value={user}
										>
											{({ selected }) => (
												<>
													<span
														className={`block truncate ${
															selected ? 'font-medium' : 'font-normal'
														}`}
													>
														{user.name}
													</span>
													{selected ? (
														<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600'>
															<CheckIcon
																className='h-5 w-5'
																aria-hidden='true'
															/>
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
									))}
							</Listbox.Options>
						</Transition>
					</div>
				</Listbox>
				<button
					type='button'
					className='w-full inline-flex justify-center rounded-md border border-transparent mt-6 bg-slate-900 px-4 py-2 text-base font-bold text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-skate-500 focus-visible:ring-offset-2'
					onClick={handleLogin}
					disabled={loading}
				>
					{loading ? 'Cargando...' : 'Ingresar'}
				</button>
			</div>
		</div>
	);
};

export default Login;
