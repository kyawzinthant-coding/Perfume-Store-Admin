import api from '.';

export const fetchMe = async () => (await api.get('auth/me')).data;

export const fetchProducts = async (q?: string) =>
  (await api.get(`products/${q ?? ''}`)).data;

export const fetchProductsListQuery = () => ({
  queryKey: ['products', 'list'],
  queryFn: () => fetchProducts(),
});
