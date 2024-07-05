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
    <QueryClientProvider client={queryClient}>
      <KvibProvider>
        <App />
        {/*TODO Check if we are in production and dont display Devtools in prod*/}
        {true && <ReactQueryDevtools initialIsOpen={false} />}
      </KvibProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
