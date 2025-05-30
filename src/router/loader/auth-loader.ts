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
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    });

    // res = { status: "success", data: { id, email, name, role } }

    if (res?.status === 'success') {
      useAuthDataStore.getState().setUser(res.data);
      return res.data;
    }

    // fallback in case something goes wrong
    useAuthDataStore.getState().setUser(null);
    return null;
  } catch {
    sessionStorage.removeItem('accessToken');
    useAuthDataStore.getState().setUser(null);
    return null;
  }
};

export const loginLoader = async () => {
  try {
    const res = await authApi.get('auth/me');

    if (res.status !== 200) {
      return null;
    }
    return redirect('/');
  } catch (error) {
    console.log(error);
    return null;
  }
};
