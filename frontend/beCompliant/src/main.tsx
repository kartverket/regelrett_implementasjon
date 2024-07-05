import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Header, KvibProvider } from '@kvib/react';
import 'material-symbols';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <KvibProvider>
        <Header />
        <App />
        <ReactQueryDevtools />
      </KvibProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
