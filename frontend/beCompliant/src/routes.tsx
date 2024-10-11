import { createBrowserRouter } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import { ActivityPage } from './pages/ActivityPage';
import { ProtectedRoute } from './components/protectedRoute/ProtectedRoute';
import { QuestionPage } from './pages/QuestionPage';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/team/:teamId',
        element: <ActivityPage />,
      },
      {
        path: '/function/:functionId',
        element: <ActivityPage />,
      },
      {
        path: '/team/:teamId/:recordId',
        element: <QuestionPage />,
      },
      {
        path: '/function/:functionId/:recordId',
        element: <QuestionPage />,
      },
      {
        path: '/',
        element: <FrontPage />,
      },
    ],
  },
]);

export default router;
