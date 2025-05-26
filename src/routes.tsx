import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import RootLayout from './components/Layout/RootLayout';
import { loginAction, logoutAction } from './router/action/auth-action';
import { authLoader, loginLoader } from './router/loader/auth-loader';

const Dashboard = lazy(() => import('./features/dashboard'));
const Login = lazy(() => import('./features/auth/Login'));

const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <div>404</div>,
    loader: authLoader,
    children: [
      {
        path: '/',
        index: true,
        element: withSuspense(Dashboard),
      },
      {
        path: '/product',
        element: <h1>ProductPage</h1>,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />, // Login is not lazy-loaded as it's usually needed immediately
    action: loginAction,
    loader: loginLoader,
  },
  {
    path: '/logout',
    action: logoutAction,
  },
]);
