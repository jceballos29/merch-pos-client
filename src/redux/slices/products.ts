import { createSlice } from '@reduxjs/toolkit';
import { ProductType } from '../../types';

export interface ProductsState {
  products: ProductType[];
}

const initialState: ProductsState = {
  products: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const productsReducer = productsSlice.reducer;
export const { setProducts } = productsSlice.actions;
