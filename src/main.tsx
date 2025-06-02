import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { router } from './routes';
import { RouterProvider } from 'react-router';
import { QueryProviders } from './provider/QueryProvider';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProviders>
      <RouterProvider router={router} />
    </QueryProviders>
    <Toaster richColors />
  </StrictMode>
);
