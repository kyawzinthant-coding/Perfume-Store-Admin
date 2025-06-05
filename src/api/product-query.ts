import { ProductCreateType } from '@/features/products/data/schema';
import api from '.';

export const fetchProducts = async (q?: string) =>
  (await api.get(`products/${q ?? ''}`)).data;

export const fetchProductsListQuery = () => ({
  queryKey: ['products'],
  queryFn: () => fetchProducts(),
});

export const fetchProduct = async (id: string) =>
  (await api.get(`products/${id}`)).data;

export const createProduct = async (product: ProductCreateType) =>
  (
    await api.post('products', product, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data;

export const updateProduct = async ({
  id,
  product,
}: {
  id: string;
  product: ProductCreateType;
}) =>
  (
    await api.post(`products/${id}`, product, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data;

export const deleteProduct = async (id: string) =>
  (await api.delete(`products/${id}`)).data;
export const OneProductQuery = (id: string) => ({
  queryKey: ['product', id],
  queryFn: () => fetchProduct(id),
});
export const fetchCategoryAndBrand = async () =>
  (await api.get('filter-type')).data;

export const fetchCategoryAndBrandQuery = () => ({
  queryKey: ['filter-type'],
  queryFn: () => fetchCategoryAndBrand(),
});
