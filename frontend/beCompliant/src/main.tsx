import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Header, KvibProvider } from '@kvib/react';
import 'material-symbols';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KvibProvider>
      <Header />
      <App />
    </KvibProvider>
  </React.StrictMode>
);
