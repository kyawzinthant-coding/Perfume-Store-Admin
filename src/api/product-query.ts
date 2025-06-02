import api from '.';

export const fetchProducts = async (q?: string) =>
  (await api.get(`products/${q ?? ''}`)).data;

export const fetchProductsListQuery = () => ({
  queryKey: ['products', 'list'],
  queryFn: () => fetchProducts(),
});

export const fetchProduct = async (id: string) =>
  (await api.get(`product/${id}`)).data;
