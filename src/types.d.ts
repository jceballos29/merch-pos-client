export type UserType = {
	_id: string;
	name: string;
	email: string;
	password: string;
	role: string;
	createdAt: string;
	updatedAt: string;
};

export type ProductType = {
	_id: string;
	name: string;
	price: number;
	createdAt: string;
	updatedAt: string;
};

export type ReportType = {
	totalSales: number;
	salesByPaymentMethod: { _id: string; total: number }[];
	productsSold: { _id: string; total: number }[];
};

export type SaleType = {
	number: number;
	_id: string;
	user: string;
	total: number;
	paymentMethod: 'cash' | 'transfer';
	products: { product: string; amount: number }[];
	createdAt: string;
	updatedAt: string;
	state: 'processing' | 'completed' | 'canceled';
};

export type SaleProductType = {
	_id?: string;
	product: string;
	amount: number;
};

export type AuthType = {
	token: string;
	user: UserType;
};
