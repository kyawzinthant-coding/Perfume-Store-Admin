import api from '.';

export const fetchMe = async () => (await api.get('auth/me')).data;

export const fetchProducts = async (q?: string) =>
  (await api.get(`products/${q ?? ''}`)).data;

export const fetchCategories = async () => (await api.get('categories')).data;

export const fetchBrands = async () => (await api.get('brands')).data;

export const fetchProductsListQuery = () => ({
  queryKey: ['products', 'list'],
  queryFn: () => fetchProducts(),
});

export const fetchCategoriesListQuery = () => ({
  queryKey: ['categories', 'list'],
  queryFn: () => fetchCategories(),
});

export const fetchBrandsListQuery = () => ({
  queryKey: ['brands', 'list'],
  queryFn: () => fetchBrands(),
});
