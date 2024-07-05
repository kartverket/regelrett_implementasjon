import { createBrowserRouter, Outlet } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import { MainTableComponent } from './pages/TablePage';
import { Header } from './components/Header';

const router = createBrowserRouter([
  {
    element: (
      <>
        <Header />
        <Outlet />
      </>),
    children: [
      {
        path: '/team/:teamName',
        element: <MainTableComponent />,
      },
      {
        path: '/',
        element: <FrontPage />,
      },
    ],
  },

]);

export default router;
