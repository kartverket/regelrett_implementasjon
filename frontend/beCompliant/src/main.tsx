import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { KvibProvider } from '@kvib/react';
import { Toaster } from '@/components/ui/sonner';
import 'material-symbols';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KvibProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors position="bottom-center" />
        <App />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </KvibProvider>
  </React.StrictMode>
);
