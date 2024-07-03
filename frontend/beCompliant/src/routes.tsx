import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './components/Login';
import FrontPage from './pages/FrontPage';
import { MainTableComponent } from './pages/TablePage';

const router = createBrowserRouter([
  {
    path: '/team/:teamName',
    element: <MainTableComponent />,
  },
  {
    path: '/',
    element: <FrontPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default router;
