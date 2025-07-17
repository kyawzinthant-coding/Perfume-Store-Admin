import api from '.';

export const fetchOrderLists = async () => (await api.get('orders')).data;

export const fetchOrderListQuery = () => ({
  queryKey: ['orders'],
  queryFn: () => fetchOrderLists(),
});

export const updateOrder = async (id: string, status: string) =>
  (await api.put(`admin/orders/${id}/status`, status)).data;
