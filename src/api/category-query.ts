import { CategoryCRUDType } from '@/features/category/data/schema';
import api from '.';

export const fetchCategories = async () => (await api.get('category')).data;

export const fetchCategoriesListQuery = () => ({
  queryKey: ['categories'],
  queryFn: () => fetchCategories(),
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
