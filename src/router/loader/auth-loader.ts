import { authApi } from '@/api';
import { fetchMe } from '@/api/query';
import { queryClient } from '@/lib/queryClient';
import { useAuthDataStore } from '@/store/useAuthStore';
import { redirect } from 'react-router';

export const authLoader: () => Promise<any> = async () => {
  try {
    const res = await queryClient.ensureQueryData({
      queryKey: ['me'],
      queryFn: fetchMe,
      staleTime: 1000 * 60 * 5, // Cache for 5
    });

    if (!res || res.status !== 'success') {
      useAuthDataStore.getState().setUser(null);
      return redirect('/login');
    }

    if (res.status !== 'success') {
      return redirect('/login');
    }

    if (res.data.role === 'admin') {
      useAuthDataStore.getState().setUser(res.data);
    }
  } catch {
    useAuthDataStore.getState().setUser(null);
    // return redirect('/login');
  }
};

export const loginLoader = async () => {
  try {
    const res = await authApi.get('admin/me');

    if (res.status !== 200) {
      return null;
    }

    return redirect('/');
  } catch (error) {
    return null;
  }
};
