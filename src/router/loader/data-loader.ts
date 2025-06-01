import { fetchCategoriesListQuery } from '@/api/query';
import { queryClient } from '@/lib/queryClient';

export const CategoryLoader = async () => {
  await queryClient.ensureQueryData(fetchCategoriesListQuery());
  return null;
};
