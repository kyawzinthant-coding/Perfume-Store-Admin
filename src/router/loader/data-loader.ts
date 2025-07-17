import { fetchBrandsListQuery } from '@/api/brand-query';
import { fetchCategoriesListQuery } from '@/api/category-query';
import { fetchDiscountListQuery } from '@/api/discount-query';
import { fetchOrderListQuery } from '@/api/order-query';
import {
  fetchCategoryAndBrandQuery,
  fetchProductsListQuery,
  OneProductQuery,
} from '@/api/product-query';
import { queryClient } from '@/lib/queryClient';
import { LoaderFunctionArgs } from 'react-router';

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

export const ProductDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  console.log('param', params);
  if (!params.id) {
    throw new Error('Product id is required');
  }
  await queryClient.ensureQueryData(fetchCategoryAndBrandQuery());
  await queryClient.ensureQueryData(OneProductQuery(params.id));
  return { productId: params.id };
};

export const CategoryandBrandLoader = async () => {
  await queryClient.ensureQueryData(fetchCategoryAndBrandQuery());
  return null;
};

export const DiscountLoader = async () => {
  await queryClient.ensureQueryData(fetchDiscountListQuery());
  return null;
};

export const OrderListLoader = async () => {
  await queryClient.ensureQueryData(fetchOrderListQuery());
};
