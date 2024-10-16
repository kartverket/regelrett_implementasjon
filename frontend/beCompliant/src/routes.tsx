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
        path: '/team/:teamId/:tableId',
        element: <ActivityPage />,
      },
      {
        path: '/function/:functionId/:tableId',
        element: <ActivityPage />,
      },
      {
        path: '/context/:contextId',
        element: <ActivityPage />,
      },
      {
        path: '/context/:contextId/:tableId',
        element: <ActivityPage />,
      },
      {
        path: '/team/:teamId/:tableId/:recordId',
        element: <QuestionPage />,
      },
      {
        path: '/function/:functionId/:tableId/:recordId',
        element: <QuestionPage />,
      },
      {
        path: '/context/:contextId/:tableId/:recordId',
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
