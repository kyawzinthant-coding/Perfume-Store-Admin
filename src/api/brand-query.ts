import api from '.';

export const fetchBrands = async () => (await api.get('brands')).data;

export const fetchBrandsListQuery = () => ({
  queryKey: ['brands', 'list'],
  queryFn: () => fetchBrands(),
});
