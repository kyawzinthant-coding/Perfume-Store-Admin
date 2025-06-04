import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import RootLayout from './components/Layout/RootLayout';
import { loginAction, logoutAction } from './router/action/auth-action';
import { authLoader, loginLoader } from './router/loader/auth-loader';
import {
  BrandLoader,
  CategoryandBrandLoader,
  CategoryLoader,
  ProductLoader,
} from './router/loader/data-loader';
import NewProductCreate from './features/products/components/new-product-create-page';
import { Error } from './components/error';
import { Loading } from './components/loading';

const Dashboard = lazy(() => import('./features/dashboard'));
const Login = lazy(() => import('./features/auth/Login'));
const Categories = lazy(() => import('./features/category'));
const Brands = lazy(() => import('./features/brands'));
const Products = lazy(() => import('./features/products'));

const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Error />,
    loader: authLoader,
    children: [
      {
        path: '/',
        index: true,
        element: withSuspense(Dashboard),
      },
      {
        path: '/product',
        children: [
          {
            path: '',
            index: true,
            element: withSuspense(Products),
            loader: ProductLoader,
          },
          {
            path: 'create',
            element: withSuspense(NewProductCreate),
            loader: CategoryandBrandLoader,
          },
        ],
      },
      {
        path: '/category',
        element: withSuspense(Categories),
        loader: CategoryLoader,
      },
      {
        path: '/brand',
        element: withSuspense(Brands),
        loader: BrandLoader,
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
