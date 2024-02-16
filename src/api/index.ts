import axios from 'axios';

const api = axios.create({
	baseURL: 'https://merch-pos-api-dev-tzmz.4.us-1.fl0.io',
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
