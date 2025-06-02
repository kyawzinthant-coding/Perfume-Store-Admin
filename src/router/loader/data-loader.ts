import { fetchBrandsListQuery } from '@/api/brand-query';
import { fetchCategoriesListQuery } from '@/api/category-query';
import { fetchProductsListQuery } from '@/api/product-query';
import { queryClient } from '@/lib/queryClient';

export const CategoryLoader = async () => {
  await queryClient.ensureQueryData(fetchCategoriesListQuery());
  return null;
};

export const BrandLoader = async () => {
  await queryClient.ensureQueryData(fetchBrandsListQuery());
  return null;
};

export const ProductLoader = async () => {
  await queryClient.ensureQueryData(fetchProductsListQuery());
  return null;
};
