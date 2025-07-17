import api from '.';
import { DiscountCRUDType } from '@/features/discount/data/schema';

export const fetchDiscountLists = async () =>
  (await api.get('admin/discounts')).data;

export const fetchDiscountListQuery = () => ({
  queryKey: ['discounts'],
  queryFn: () => fetchDiscountLists(),
});

export const createDiscount = async (discount: DiscountCRUDType) =>
  (
    await api.post('admin/discounts', discount, {
      headers: { 'Content-Type': 'application/json' },
    })
  ).data;

export const updateDiscount = async (id: string, discount: DiscountCRUDType) =>
  (
    await api.put(`admin/discounts/${id}`, discount, {
      headers: { 'Content-Type': 'application/json' },
    })
  ).data;

export const disableDiscount = async (id: string) =>
  (await api.delete(`admin/discounts/${id}`)).data;
