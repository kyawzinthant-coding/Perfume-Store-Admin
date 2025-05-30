import api, { authApi } from '@/api';
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
  };

  try {
    const response = await authApi.post('auth/login', authData);

    if (response.status !== 200) {
      return { error: response.data || 'Login Failed!' };
    }
    await queryClient.invalidateQueries({ queryKey: ['me'] });
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
