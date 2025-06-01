import { CategoryCRUDType } from './../features/category/data/schema';

import api from '.';

export const fetchMe = async () => (await api.get('auth/me')).data;

export const fetchProducts = async (q?: string) =>
  (await api.get(`products/${q ?? ''}`)).data;

export const fetchCategories = async () => (await api.get('category')).data;

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

export const createCategory = async (category: CategoryCRUDType) =>
  (
    await api.post('category', category, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data;

export const updateCategory = async (id: string, category: CategoryCRUDType) =>
  (
    await api.post(`category/${id}`, category, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data;

export const deleteCategory = async (id: string) =>
  (await api.delete(`category/${id}`)).data;
