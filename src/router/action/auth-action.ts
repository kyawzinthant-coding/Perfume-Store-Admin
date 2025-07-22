import api, { authApi } from '@/api';
import { fetchMe } from '@/api/query';
import { queryClient } from '@/lib/queryClient';
import { useAuthDataStore } from '@/store/useAuthStore';
import { AxiosError } from 'axios';
import { ActionFunctionArgs, redirect } from 'react-router';

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  const authData = {
    email: email as string,
    password: password as string,
    scope: 'admin',
  };

  try {
    const response = await authApi.post('auth/admin/login', authData);

    if (response.status !== 200) {
      return { error: response.data || 'Login Failed!' };
    }

    const res = await queryClient.ensureQueryData({
      queryKey: ['me'],
      queryFn: fetchMe,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    });

    if (res?.status === 'success') {
      useAuthDataStore.getState().setUser(res.data);
    } else {
      useAuthDataStore.getState().setUser(null);
    }

    const redirectTo = new URL(request.url).searchParams.get('redirect') || '/';

    return redirect(redirectTo);
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: 'Login failed' };
    }
  }
};

export const logoutAction = async () => {
  try {
    await api.post('auth/logout');
  } catch (error) {
    console.log('Logout failed:', error);
  }

  // Ensure user state is cleared even if API request fails
  useAuthDataStore.getState().logout();
  await queryClient.invalidateQueries({ queryKey: ['me'] });

  return redirect('/login');
};
