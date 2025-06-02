import { BrandCRUDType } from '@/features/brands/data/schema';
import api from '.';

export const fetchBrands = async () => (await api.get('brand')).data;

export const fetchBrandsListQuery = () => ({
  queryKey: ['brands'],
  queryFn: () => fetchBrands(),
});

export const createBrand = async (brand: BrandCRUDType) =>
  (
    await api.post('brand', brand, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data;

export const updateBrand = async (id: string, brand: BrandCRUDType) =>
  (
    await api.post(`brand/${id}`, brand, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data;

export const deleteBrand = async (id: string) =>
  (await api.delete(`brand/${id}`)).data;
