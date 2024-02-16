import api from '..';
import { SaleType } from '../../types';

export const getSales = async () => {
	return await api.get('/sales');
};

export const getSale = async (id: string) => {
	return await api.get(`/sales/${id}`);
};

export const createSale = async () => {
	return await api.post('/sales');
};

export const updateSale = async (
	id: string,
	options: Partial<SaleType>,
) => {
	return await api.patch(`/sales/${id}`, options);
};

export const getReport = async () => {
	return await api.get('/sales/info/report');
};
