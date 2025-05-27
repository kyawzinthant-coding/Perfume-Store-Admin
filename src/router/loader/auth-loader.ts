import { authApi } from '@/api';
import { fetchMe } from '@/api/query';
import { queryClient } from '@/lib/queryClient';
import { useAuthDataStore } from '@/store/useAuthStore';
import { redirect } from 'react-router';

export const authLoader: () => Promise<any> = async () => {
  try {
    const user = await queryClient.ensureQueryData({
      queryKey: ['me'],
      queryFn: fetchMe,
      staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
      retry: 1, // Reduce retries to avoid infinite loops
    });

    console.log('User loaded from loader:', user);
    if (user.stauts == 'success') {
    }

    useAuthDataStore.getState().setUser(user); // ✅ Store user in Zustand
    return user;
  } catch {
    sessionStorage.removeItem('accessToken');
    useAuthDataStore.getState().setUser(null); // Reset store on failure
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
