import { fetchBrandsListQuery } from '@/api/brand-query';
import { fetchCategoriesListQuery } from '@/api/category-query';
import { queryClient } from '@/lib/queryClient';

export const CategoryLoader = async () => {
  await queryClient.ensureQueryData(fetchCategoriesListQuery());
  return null;
};

export const BrandLoader = async () => {
  await queryClient.ensureQueryData(fetchBrandsListQuery());
  return null;
};
