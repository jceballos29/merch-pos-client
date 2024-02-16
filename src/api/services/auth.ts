import api from '..';

export const login = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const response = await api.post('/auth/login', {
		email,
		password,
	});

	return response.data;
};

export const me = async () => {
	const response = await api.get('/auth/me');
	return response.data;
};