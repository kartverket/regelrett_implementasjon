import { createBrowserRouter } from 'react-router-dom';
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
]);

export default router;
