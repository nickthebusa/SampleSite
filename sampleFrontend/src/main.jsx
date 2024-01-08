// import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './Router.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import './main.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(

  <QueryClientProvider client={queryClient}>
    <Router />
    <ReactQueryDevtools />
  </QueryClientProvider>
)
