import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { KvibProvider } from '@kvib/react';
import 'material-symbols';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KvibProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </KvibProvider>
  </React.StrictMode>
);
