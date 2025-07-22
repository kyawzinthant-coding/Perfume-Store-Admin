import api from '.';

export const fetchMe = async () => (await api.get('admin/me')).data;

export const FetchUsers = async () => (await api.get('admin/users')).data;

export const fetchUserQuery = () => ({
  queryKey: ['users'],
  queryFn: FetchUsers,
});
