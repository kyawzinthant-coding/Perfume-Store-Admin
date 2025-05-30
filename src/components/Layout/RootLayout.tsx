import { Outlet } from 'react-router';
import { useEffect } from 'react';

import { useAuthDataStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { useLocation } from 'react-router';

import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './AppSidebar';

import { cn } from '@/lib/utils';
import ProgressBar from '@/lib/ProgressBar';
import { fetchMe } from '@/api/query';

function RootLayout() {
  const userInStore = useAuthDataStore((state) => state.user);

  console.log('userStore', userInStore);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false, // Don't retry if failed
    enabled: !userInStore?.email,
  });

  const value = 5;

  if (value <= 5) {
    console.log(
      'User data is not available yet, waiting for query to resolve...'
    );
  }

  useEffect(() => {
    useAuthDataStore.getState().setUser(user.data || null);
  }, [user]);

  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  const defaultOpen = Cookies.get('sidebar:state') !== 'false';

  return (
    <div className="min-h-screen bg-white/80 flex flex-col">
      <SidebarProvider defaultOpen={defaultOpen}>
        <ProgressBar />
        <AppSidebar />

        <div
          id="content"
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}

export default RootLayout;
