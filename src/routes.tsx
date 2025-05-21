// import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router';

// const withSuspense = (Component: React.ComponentType) => {
//   return function WithSuspense(props: any) {
//     return (
//       <Suspense fallback={<div>Loading...</div>}>
//         <Component {...props} />
//       </Suspense>
//     );
//   };
// };

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home</div>,
    errorElement: <div>404</div>,
    children: [
      {
        path: '/',
        element: <div>Home</div>,
        errorElement: <div>404</div>,
        children: [
          {
            path: '/',
            element: <div>Home</div>,
            errorElement: <div>404</div>,
          },
        ],
      },
    ],
  },
]);
